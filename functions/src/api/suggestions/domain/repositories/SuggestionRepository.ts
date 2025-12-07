import { Suggestion, SuggestionStatus } from "../Suggestion";

export interface SuggestionRepository {
    findAllByOrganizationIdWithPagination(
        id: string,
        offset: number,
        limit: number,
        status?: SuggestionStatus
    ): Promise<[Suggestion[], number]>;

    findById(id: string): Promise<Suggestion | null>;

    save(suggestion: Suggestion): Promise<Suggestion>;

    delete(id: string): Promise<void>;
}