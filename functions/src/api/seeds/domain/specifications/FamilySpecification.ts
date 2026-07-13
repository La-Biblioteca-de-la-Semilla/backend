import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class FamilySpecification implements SeedSpecification {
    constructor(private readonly family: string) {}

    isSatisfiedBy(seed: Seed): boolean {
        return seed.family === this.family;
    }
}
