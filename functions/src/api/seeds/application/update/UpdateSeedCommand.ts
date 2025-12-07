export class UpdateSeedCommand {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly species?: string,
        public readonly image?: string,
        public readonly description?: string,
        public readonly sentOn?: string,
        public readonly tags?: string[],
        public readonly sow?: number[],
        public readonly family?: string,
        public readonly sfgOriginal?: number,
        public readonly sfgMultisow?: number,
        public readonly sfgClump?: number,
        public readonly germinationMin?: number,
        public readonly germinationMax?: number
    ) {}
}