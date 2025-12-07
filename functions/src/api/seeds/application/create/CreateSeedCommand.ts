export class CreateSeedCommand {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly species: string,
        public readonly image: string,
        public readonly owner: string,
        public readonly description: string | null = null,
        public readonly sentOn: string | null = null,
        public readonly tags: string[] | null = null,
        public readonly sow: number[] | null = null,
        public readonly family: string | null = null,
        public readonly sfgOriginal: number | null = null,
        public readonly sfgMultisow: number | null = null,
        public readonly sfgClump: number | null = null,
        public readonly germinationMin: number | null = null,
        public readonly germinationMax: number | null = null
    ) {}
}