import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class OwnerSpecification implements SeedSpecification {
    constructor(private readonly ownerIds: string[]) {}

    isSatisfiedBy(seed: Seed): boolean {
        return this.ownerIds.includes(seed.owner);
    }
}
