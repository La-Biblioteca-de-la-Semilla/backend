import {Seed} from "../../domain/Seed";

export class UpdateSeedResult {
    constructor(
        public readonly id: string,
        public name: string,
        public species: string,
        public image: string,
        public readonly owner: string,
        public description: string | null = null,
        public sentOn: string | null = null,
        public tags: string[] | null = null,
        public sow: number[] | null = null,
        public family: string | null = null,
        public sfgOriginal: number | null = null,
        public sfgMultisow: number | null = null,
        public sfgClump: number | null = null,
        public germinationMin: number | null = null,
        public germinationMax: number | null = null
    ) {
    }

    static fromDomain(seed: Seed): UpdateSeedResult {
        return new UpdateSeedResult(
            seed.id,
            seed.name,
            seed.species,
            seed.image,
            seed.owner,
            seed.description,
            seed.sentOn,
            seed.tags,
            seed.sow,
            seed.family,
            seed.sfgOriginal,
            seed.sfgMultisow,
            seed.sfgClump,
            seed.germinationMin,
            seed.germinationMax
        );
    }
}