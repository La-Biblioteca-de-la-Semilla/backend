import {SeedAPIResponse} from "./SeedAPIResponse";

export class ListSeedAPIResponse {
    constructor(
        public readonly seeds: SeedAPIResponse[]
    ) {
    }
}