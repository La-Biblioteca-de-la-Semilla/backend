
export type SuggestionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export class Suggestion {
    constructor(
        public readonly id: string,
        public seedId: string,
        public organizationId: string,
        public createdAt: Date,
        public createdBy: string,
        public status: SuggestionStatus,
        public name: string | null = null,
        public species: string | null = null,
        public image: string | null = null,
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

    accept() {
        this.status = "ACCEPTED";
    }

    reject() {
        this.status = "REJECTED";
    }
}