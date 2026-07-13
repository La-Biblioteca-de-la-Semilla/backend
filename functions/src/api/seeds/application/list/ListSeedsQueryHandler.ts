import {QueryHandler} from "../../../shared/application/QueryHandler";
import {ListSeedsQuery} from "./ListSeedsQuery";
import {ListSeedsResult, SeedResult} from "./ListSeedsResult";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";
import {AndSpecification} from "../../domain/specifications/AndSpecification";
import {OrSpecification} from "../../domain/specifications/OrSpecification";
import {SearchBarSpecification} from "../../domain/specifications/SearchBarSpecification";
import {TagsSpecification} from "../../domain/specifications/TagsSpecification";
import {UserHaveSpecification} from "../../domain/specifications/UserHaveSpecification";
import {UserWantSpecification} from "../../domain/specifications/UserWantSpecification";
import {SowingSpecification} from "../../domain/specifications/SowingSpecification";
import {SeedSpecification} from "../../domain/specifications/SeedSpecification";

export class ListSeedsQueryHandler implements QueryHandler<ListSeedsQuery, ListSeedsResult> {

    constructor(
        private readonly repository: SeedRepository,
    ) {
    }

    async handle(query: ListSeedsQuery): Promise<ListSeedsResult> {
        const specification = this.buildInMemorySpecification(query);

        let filteredSeeds;
        let total: number;

        if (specification) {
            const {seeds: allSeeds} = await this.repository.findByFilters(query.filters);
            filteredSeeds = allSeeds.filter(seed => specification.isSatisfiedBy(seed));
            total = filteredSeeds.length;
            const offset = (query.page - 1) * query.limit;
            filteredSeeds = filteredSeeds.slice(offset, offset + query.limit);
        } else {
            const result = await this.repository.findByFilters(query.filters, query.page, query.limit);
            filteredSeeds = result.seeds;
            total = result.total;
        }

        const seedResults = filteredSeeds.map((seed) => {
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

    private buildInMemorySpecification(query: ListSeedsQuery): SeedSpecification | null {
        const {filters} = query;
        const specs: SeedSpecification[] = [];

        if (filters.search) {
            specs.push(new SearchBarSpecification(filters.search));
        }

        if (filters.tags && filters.tags.length > 0) {
            specs.push(new TagsSpecification(filters.tags));
        }

        if (filters.sowing && filters.sowing.length > 0) {
            specs.push(new SowingSpecification(filters.sowing));
        }

        const userSpecs: SeedSpecification[] = [];
        if (filters.userHaveIds && filters.userHaveIds.length > 0) {
            userSpecs.push(new UserHaveSpecification(filters.userHaveIds));
        }
        if (filters.userWantIds && filters.userWantIds.length > 0) {
            userSpecs.push(new UserWantSpecification(filters.userWantIds));
        }
        if (userSpecs.length > 0) {
            specs.push(new OrSpecification(userSpecs));
        }

        if (specs.length === 0) return null;

        return new AndSpecification(specs);
    }
}
