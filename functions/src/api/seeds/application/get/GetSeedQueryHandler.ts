import {QueryHandler} from "../../../shared/application/QueryHandler";
import {GetSeedQuery} from "./GetSeedQuery";
import {GetSeedResult} from "./GetSeedResult";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";

export class GetSeedQueryHandler implements QueryHandler<GetSeedQuery, GetSeedResult> {
    constructor(private readonly repository: SeedRepository) {
    }

    async handle(query: GetSeedQuery): Promise<GetSeedResult | null> {
        const seed = await this.repository.findById(query.id);

        if (!seed) {
            return null;
        }

        return new GetSeedResult(
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
            seed.status
        );
    }
}