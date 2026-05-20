import {QueryHandler} from "../../../shared/application/QueryHandler";
import {ListSeedsQuery} from "./ListSeedsQuery";
import {ListSeedsResult, SeedResult} from "./ListSeedsResult";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";
import {CacheService} from "../../../shared/application/CacheService";
import {SEEDS_LIST_CACHE_KEY} from "../../config/CacheKeys";

export class ListSeedsQueryHandler implements QueryHandler<ListSeedsQuery, ListSeedsResult> {

    constructor(
        private readonly repository: SeedRepository,
        private readonly cacheService: CacheService
    ) {
    }

    async handle(query: ListSeedsQuery): Promise<ListSeedsResult> {
        const isDraft = query.status === "draft";

        if (!isDraft) {
            const cachedResult = this.cacheService.get<ListSeedsResult>(SEEDS_LIST_CACHE_KEY);
            if (cachedResult) {
                return cachedResult;
            }
        }

        const seeds = await this.repository.findAllByStatus(query.status);
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

        const result = new ListSeedsResult(seedResults);

        if (!isDraft) {
            this.cacheService.set(SEEDS_LIST_CACHE_KEY, result);
        }

        return result;
    }
}