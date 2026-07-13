import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class TagsSpecification implements SeedSpecification {
    constructor(private readonly tags: string[]) {}

    isSatisfiedBy(seed: Seed): boolean {
        return this.tags.every(tag => (seed.tags ?? []).includes(tag));
    }
}
