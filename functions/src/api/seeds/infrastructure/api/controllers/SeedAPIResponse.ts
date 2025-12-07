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
        public germinationMax: number | null = null
    ) {
    }
}