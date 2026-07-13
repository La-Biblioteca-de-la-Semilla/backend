import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class UserHaveSpecification implements SeedSpecification {
    constructor(private readonly userHaveIds: string[]) {}

    isSatisfiedBy(seed: Seed): boolean {
        return this.userHaveIds.includes(seed.id);
    }
}
