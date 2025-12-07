export class CreateSuggestionCommand {
    constructor(
        public readonly seedId: string,
        public readonly userId: string,
        public readonly name: string | null = null,
        public readonly species: string | null = null,
        public readonly image: string | null = null,
        public readonly description: string | null = null,
        public readonly sow: number[] | null = null,
        public readonly sentOn: string | null = null,
        public readonly tags: string[] | null = null,
        public readonly family: string | null = null,
        public readonly sfgOriginal: number | null = null,
        public readonly sfgMultisow: number | null = null,
        public readonly sfgClump: number | null = null,
        public readonly germinationMin: number | null = null,
        public readonly germinationMax: number | null = null
    ) {}
}