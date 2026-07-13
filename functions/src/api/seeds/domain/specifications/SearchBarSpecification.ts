import {SeedSpecification} from "./SeedSpecification";
import {Seed} from "../Seed";

export class SearchBarSpecification implements SeedSpecification {
    private readonly searchUpper: string;

    constructor(search: string) {
        this.searchUpper = search.toUpperCase();
    }

    isSatisfiedBy(seed: Seed): boolean {
        return (
            seed.name.toUpperCase().includes(this.searchUpper) ||
            seed.species.toUpperCase().includes(this.searchUpper)
        );
    }
}
