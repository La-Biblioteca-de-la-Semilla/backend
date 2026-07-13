import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class UserWantSpecification implements SeedSpecification {
    constructor(private readonly userWantIds: string[]) {}

    isSatisfiedBy(seed: Seed): boolean {
        return this.userWantIds.includes(seed.id);
    }
}
