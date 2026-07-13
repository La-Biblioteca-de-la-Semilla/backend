import {SeedFilters} from "./SeedFilters";

export class ListSeedsQuery {
    constructor(
        public readonly page: number = 1,
        public readonly limit: number = 20,
        public readonly filters: SeedFilters = {}
    ) {}
}