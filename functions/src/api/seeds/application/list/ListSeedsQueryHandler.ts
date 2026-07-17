import {QueryHandler} from "../../../shared/application/QueryHandler";
import {ListSeedsQuery} from "./ListSeedsQuery";
import {ListSeedsResult, SeedResult} from "./ListSeedsResult";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";

export class ListSeedsQueryHandler implements QueryHandler<ListSeedsQuery, ListSeedsResult> {

    constructor(
        private readonly repository: SeedRepository,
    ) {
    }

    async handle(query: ListSeedsQuery): Promise<ListSeedsResult> {
        const {seeds, total} = await this.repository.findByFilters(query.filters, query.page, query.limit);

        const seedResults = seeds.map((seed) => {
            return new SeedResult(
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
        });

        return new ListSeedsResult(seedResults, total, query.page, query.limit);
    }
}
