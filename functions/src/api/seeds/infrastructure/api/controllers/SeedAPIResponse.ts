import {SeedStatus} from "../../../domain/Seed";

export interface SeedLike {
    id: string;
    name: string;
    species: string;
    image: string;
    owner: string;
    description: string | null;
    sentOn: string | null;
    tags: string[] | null;
    sow: number[] | null;
    family: string | null;
    sfgOriginal: number | null;
    sfgMultisow: number | null;
    sfgClump: number | null;
    germinationMin: number | null;
    germinationMax: number | null;
    status: SeedStatus;
}

export class SeedAPIResponse {
    constructor(
        public readonly id: string,
        public name: string,
        public species: string,
        public image: string,
        public owner: string,
        public description: string | null = null,
        public sentOn: string | null = null,
        public tags: string[] | null = null,
        public sow: number[] | null = null,
        public family: string | null = null,
        public sfgOriginal: number | null = null,
        public sfgMultisow: number | null = null,
        public sfgClump: number | null = null,
        public germinationMin: number | null = null,
        public germinationMax: number | null = null,
        public status: SeedStatus = "draft"
    ) {
    }

    static fromSeed(seed: SeedLike): SeedAPIResponse {
        return new SeedAPIResponse(
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
            seed.germinationMax,
            seed.status
        );
    }
}