export class GetSeedResult {
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
        public readonly germinationMax: number | null
    ) {}
}