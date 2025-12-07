import { QueryHandler } from "../../../shared/application/QueryHandler";
import { GetSuggestionQuery } from "./GetSuggestionQuery";
import { SuggestionRepository } from "../../domain/repositories/SuggestionRepository";
import {GetSuggestionResult} from "./GetSuggestionResult";

export class GetSuggestionQueryHandler implements QueryHandler<GetSuggestionQuery, GetSuggestionResult | null> {
    constructor(private readonly repository: SuggestionRepository) {}

    async handle(query: GetSuggestionQuery): Promise<GetSuggestionResult | null> {
        const result = await this.repository.findById(query.id);

        if (!result) {
            return null;
        }

        return GetSuggestionResult.fromDomain(result);
    }
}