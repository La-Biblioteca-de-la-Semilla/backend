import { QueryHandler } from "../../../shared/application/QueryHandler";
import { ListSuggestionsQuery } from "./ListSuggestionsQuery";
import { SuggestionRepository } from "../../domain/repositories/SuggestionRepository";
import {OrganizationRepository} from "../../../organization/domain/OrganizationRepository";
import {ListSuggestionsResult, SuggestionResult} from "./ListSuggestionsResult";

export class ListSuggestionsQueryHandler implements QueryHandler<ListSuggestionsQuery, ListSuggestionsResult> {
    constructor(
        private readonly repository: SuggestionRepository,
        private readonly organizationRepository: OrganizationRepository
    ) {}

    async handle(query: ListSuggestionsQuery): Promise<ListSuggestionsResult> {
        const { offset, limit, status } = query;

        const organization = await this.organizationRepository.findAllByOwnerId(query.userId);
        if (organization.length === 0) {
            throw new Error("Organization not found");
        }

        const [suggestions, total] = await this.repository.findAllByOrganizationIdWithPagination(organization[0].id, offset, limit, status);

        const suggestionResults = suggestions.map(suggestion => SuggestionResult.fromDomain(suggestion));

        return new ListSuggestionsResult(suggestionResults, total, offset, limit);
    }
}