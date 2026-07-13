import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class OrSpecification implements SeedSpecification {
    constructor(private readonly specifications: SeedSpecification[]) {}

    isSatisfiedBy(seed: Seed): boolean {
        return this.specifications.some(spec => spec.isSatisfiedBy(seed));
    }
}
