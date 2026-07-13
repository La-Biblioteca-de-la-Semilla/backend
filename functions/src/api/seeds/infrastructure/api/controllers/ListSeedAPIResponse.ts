import {SeedAPIResponse} from "./SeedAPIResponse";

export class ListSeedAPIResponse {
    constructor(
        public readonly seeds: SeedAPIResponse[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number
    ) {
    }
}