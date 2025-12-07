import {Suggestion, SuggestionStatus} from "../../domain/Suggestion";

export class RejectSuggestionResult {
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

    static fromDomain(result: Suggestion) {
        return new RejectSuggestionResult(
            result.id,
            result.seedId,
            result.organizationId,
            result.createdAt,
            result.createdBy,
            result.status,
            result.name,
            result.species,
            result.image,
            result.description,
            result.sentOn,
            result.tags,
            result.sow,
            result.family,
            result.sfgOriginal,
            result.sfgMultisow,
            result.sfgClump,
            result.germinationMin,
            result.germinationMax
        );
    }
}