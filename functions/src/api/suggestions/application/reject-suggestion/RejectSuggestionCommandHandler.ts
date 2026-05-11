import { CommandHandler } from "../../../shared/application/CommandHandler";
import { RejectSuggestionCommand } from "./RejectSuggestionCommand";
import { SuggestionRepository } from "../../domain/repositories/SuggestionRepository";
import {RejectSuggestionResult} from "./RejectSuggestionResult";

export class RejectSuggestionCommandHandler implements CommandHandler<RejectSuggestionCommand, RejectSuggestionResult> {
    constructor(
        private readonly suggestionRepository: SuggestionRepository
    ) {}

    async handle(command: RejectSuggestionCommand): Promise<RejectSuggestionResult> {
        const suggestion = await this.suggestionRepository.findById(command.suggestionId);
        if (!suggestion) {
            throw new Error(`Suggestion with ID ${command.suggestionId} not found`);
        }

        suggestion.reject();
        const result = await this.suggestionRepository.save(suggestion);
        return RejectSuggestionResult.fromDomain(result);
    }
}
