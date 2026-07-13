import {PaginatedSeeds, SeedRepository} from "../../domain/repositories/SeedRepository";
import {Seed, SeedStatus} from "../../domain/Seed";
import * as admin from "firebase-admin";
import {SeedMapper} from "./mappers/SeedMapper";
import {SeedEntity} from "./entities/SeedEntity";
import {SeedFilters} from "../../application/list/SeedFilters";

export class FirestoreSeedRepository implements SeedRepository {
    private db = admin.firestore().collection("seeds");

    async findAll(): Promise<Seed[]> {
        const snapshot = await this.db.get();
        return snapshot.docs.map(doc => {
            const seedEntity = SeedEntity.fromFirestore(doc);
            return SeedMapper.toDomain(seedEntity);
        });
    }

    private buildBaseQuery(filters: SeedFilters): FirebaseFirestore.Query {
        const status: SeedStatus = filters.status ?? "published";
        let query: FirebaseFirestore.Query = this.db.where("status", "==", status);

        if (filters.ownerIds && filters.ownerIds.length > 0) {
            query = query.where("owner", "in", filters.ownerIds);
        }

        if (filters.family) {
            query = query.where("family", "==", filters.family);
        }

        if (filters.sentOn) {
            query = query.where("sentOn", "==", filters.sentOn);
        }

        return query;
    }

    async findByFilters(filters: SeedFilters, page?: number, limit?: number): Promise<PaginatedSeeds> {
        const baseQuery = this.buildBaseQuery(filters);
        if (page !== undefined && limit !== undefined) {
            const countSnapshot = await baseQuery.count().get();
            const total = countSnapshot.data().count;
            const offset = (page - 1) * limit;
            const snapshot = await baseQuery.orderBy("name").offset(offset).limit(limit).get();
            const seeds = snapshot.docs.map(doc => SeedMapper.toDomain(SeedEntity.fromFirestore(doc)));
            return {seeds, total};
        } else {
            const snapshot = await baseQuery.get();
            const seeds = snapshot.docs.map(doc => SeedMapper.toDomain(SeedEntity.fromFirestore(doc)));
            return {seeds, total: seeds.length};
        }
    }

    async findById(id: string): Promise<Seed | null> {
        const snapshot = await this.db.doc(id).get();
        if (!snapshot.exists) return null;
        const seedEntity = SeedEntity.fromFirestore(snapshot);
        return SeedMapper.toDomain(seedEntity);
    }

    async save(seed: Seed): Promise<Seed> {
        const seedEntity = SeedMapper.toEntity(seed);

        if (seedEntity.id && seedEntity.id.trim() !== "") {
            await this.db.doc(seedEntity.id).set(seedEntity.toFirestore(), {merge: true});
            return seed;
        }
        else {
            const ref = await this.db.add(seedEntity.toFirestore());
            seedEntity.id = ref.id;
            return SeedMapper.toDomain(seedEntity);
        }
    }

    async delete(id: string): Promise<void> {
        const doc = await this.db.doc(id).get();
        if (!doc.exists) {
            throw new Error(`Seed with ID ${id} not found`);
        }

        await this.db.doc(id).delete();
    }

}
