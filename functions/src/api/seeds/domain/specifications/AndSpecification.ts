import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class AndSpecification implements SeedSpecification {
    constructor(private readonly specifications: SeedSpecification[]) {}

    isSatisfiedBy(seed: Seed): boolean {
        return this.specifications.every(spec => spec.isSatisfiedBy(seed));
    }
}
