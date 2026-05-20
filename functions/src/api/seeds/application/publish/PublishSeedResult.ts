import {Seed, SeedStatus} from "../../domain/Seed";

export class PublishSeedResult {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly species: string,
        public readonly image: string,
        public readonly owner: string,
        public readonly description: string | null,
        public readonly sentOn: string | null,
        public readonly tags: string[] | null,
        public readonly sow: number[] | null,
        public readonly family: string | null,
        public readonly sfgOriginal: number | null,
        public readonly sfgMultisow: number | null,
        public readonly sfgClump: number | null,
        public readonly germinationMin: number | null,
        public readonly germinationMax: number | null,
        public readonly status: SeedStatus
    ) {}

    static fromDomain(seed: Seed): PublishSeedResult {
        return new PublishSeedResult(
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
