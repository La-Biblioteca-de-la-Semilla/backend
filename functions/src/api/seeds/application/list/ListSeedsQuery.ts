import {SeedStatus} from "../../domain/Seed";

export class ListSeedsQuery {
    constructor(public readonly status: SeedStatus = "published") {}
}