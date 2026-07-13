import {Seed} from "../Seed";

export interface SeedSpecification {
    isSatisfiedBy(seed: Seed): boolean;
}
