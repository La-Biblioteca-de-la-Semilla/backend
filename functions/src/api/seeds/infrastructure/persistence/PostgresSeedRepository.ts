import {PaginatedSeeds, SeedRepository} from "../../domain/repositories/SeedRepository";
import {Seed, SeedStatus} from "../../domain/Seed";
import {SeedFilters} from "../../application/list/SeedFilters";
import {getPool} from "./PostgresClient";

interface SeedRow {
    id: string;
    name: string;
    species: string;
    image: string;
    owner: string;
    description: string | null;
    sent_on: string | null;
    tags: string[] | null;
    sow: number[] | null;
    family: string | null;
    sfg_original: number | null;
    sfg_multisow: number | null;
    sfg_clump: number | null;
    germination_min: number | null;
    germination_max: number | null;
    status: SeedStatus;
    user_have_ids: string[];
    user_want_ids: string[];
}

function rowToSeed(row: SeedRow): Seed {
    return new Seed(
        row.id,
        row.name,
        row.species,
        row.image,
        row.owner,
        row.description,
        row.sent_on,
        row.tags,
        row.sow,
        row.family,
        row.sfg_original,
        row.sfg_multisow,
        row.sfg_clump,
        row.germination_min,
        row.germination_max,
        row.status
    );
}

export class PostgresSeedRepository implements SeedRepository {
    private get pool() {
        return getPool();
    }

    async findAll(): Promise<Seed[]> {
        const result = await this.pool.query<SeedRow>("SELECT * FROM seeds ORDER BY name");
        return result.rows.map(rowToSeed);
    }

    async findByFilters(filters: SeedFilters, page?: number, limit?: number): Promise<PaginatedSeeds> {
        const params: unknown[] = [];

        const conditions: string[] = [];

        const status: SeedStatus = filters.status ?? "published";
        params.push(status);
        conditions.push(`status = $${params.length}`);

        if (filters.ownerIds && filters.ownerIds.length > 0) {
            params.push(filters.ownerIds);
            conditions.push(`owner = ANY($${params.length})`);
        }

        if (filters.family) {
            params.push(filters.family);
            conditions.push(`family = $${params.length}`);
        }

        if (filters.sentOn) {
            params.push(filters.sentOn);
            conditions.push(`sent_on = $${params.length}`);
        }

        if (filters.search) {
            params.push(`%${filters.search.toLowerCase()}%`);
            conditions.push(`(LOWER(name) LIKE $${params.length} OR LOWER(species) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`);
        }

        if (filters.tags && filters.tags.length > 0) {
            params.push(filters.tags);
            conditions.push(`tags @> $${params.length}`);
        }

        if (filters.sowing && filters.sowing.length > 0) {
            params.push(filters.sowing);
            conditions.push(`sow @> $${params.length}`);
        }

        if (filters.userHaveIds && filters.userHaveIds.length > 0 && filters.userWantIds && filters.userWantIds.length > 0) {
            params.push(filters.userHaveIds);
            params.push(filters.userWantIds);
            conditions.push(`(user_have_ids && $${params.length - 1} OR user_want_ids && $${params.length})`);
        } else if (filters.userHaveIds && filters.userHaveIds.length > 0) {
            params.push(filters.userHaveIds);
            conditions.push(`user_have_ids && $${params.length}`);
        } else if (filters.userWantIds && filters.userWantIds.length > 0) {
            params.push(filters.userWantIds);
            conditions.push(`user_want_ids && $${params.length}`);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const countResult = await this.pool.query<{count: string}>(
            `SELECT COUNT(*) FROM seeds ${where}`,
            params
        );
        const total = parseInt(countResult.rows[0].count, 10);

        let dataQuery = `SELECT * FROM seeds ${where} ORDER BY name`;
        const dataParams = [...params];

        if (page !== undefined && limit !== undefined) {
            const offset = (page - 1) * limit;
            dataParams.push(limit);
            dataParams.push(offset);
            dataQuery += ` LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`;
        }

        const dataResult = await this.pool.query<SeedRow>(dataQuery, dataParams);
        const seeds = dataResult.rows.map(rowToSeed);

        return {seeds, total};
    }

    async findById(id: string): Promise<Seed | null> {
        const result = await this.pool.query<SeedRow>(
            "SELECT * FROM seeds WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) return null;
        return rowToSeed(result.rows[0]);
    }

    async save(seed: Seed): Promise<Seed> {
        await this.pool.query(
            `INSERT INTO seeds (
                id, name, species, image, owner, description, sent_on, tags, sow,
                family, sfg_original, sfg_multisow, sfg_clump, germination_min,
                germination_max, status
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                species = EXCLUDED.species,
                image = EXCLUDED.image,
                description = EXCLUDED.description,
                sent_on = EXCLUDED.sent_on,
                tags = EXCLUDED.tags,
                sow = EXCLUDED.sow,
                family = EXCLUDED.family,
                sfg_original = EXCLUDED.sfg_original,
                sfg_multisow = EXCLUDED.sfg_multisow,
                sfg_clump = EXCLUDED.sfg_clump,
                germination_min = EXCLUDED.germination_min,
                germination_max = EXCLUDED.germination_max,
                status = EXCLUDED.status`,
            [
                seed.id,
                seed.name,
                seed.species,
                seed.image,
                seed.owner,
                seed.description,
                seed.sentOn,
                seed.tags,
                seed.sow,
                seed.family,
                seed.sfgOriginal,
                seed.sfgMultisow,
                seed.sfgClump,
                seed.germinationMin,
                seed.germinationMax,
                seed.status,
            ]
        );
        return seed;
    }

    async delete(id: string): Promise<void> {
        const result = await this.pool.query(
            "DELETE FROM seeds WHERE id = $1",
            [id]
        );
        if (result.rowCount === 0) {
            throw new Error(`Seed with ID ${id} not found`);
        }
    }
}
