import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class SentOnSpecification implements SeedSpecification {
    constructor(private readonly sentOn: string) {}

    isSatisfiedBy(seed: Seed): boolean {
        if (this.sentOn === "N/A") {
            return seed.sentOn === null || seed.sentOn === "";
        }
        return seed.sentOn === this.sentOn;
    }
}
