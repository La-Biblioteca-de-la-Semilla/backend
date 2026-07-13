import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class SowingSpecification implements SeedSpecification {
    constructor(private readonly sowing: number[]) {}

    isSatisfiedBy(seed: Seed): boolean {
        return this.sowing.some(value => (seed.sow ?? []).includes(value));
    }
}
