import { CommandHandler } from "../../../shared/application/CommandHandler";
import { AcceptSuggestionCommand } from "./AcceptSuggestionCommand";
import { SuggestionRepository } from "../../domain/repositories/SuggestionRepository";
import {SuggestionAcceptedEvent} from "../../domain/events/SuggestionAcceptedEvent";
import {EventBus} from "../../../shared/domain/events/EventBus";
import {AcceptSuggestionResult} from "./AcceptSuggestionResult";

export class AcceptSuggestionCommandHandler implements CommandHandler<AcceptSuggestionCommand, AcceptSuggestionResult> {
    constructor(
        private readonly suggestionRepository: SuggestionRepository,
        private readonly eventBus: EventBus
    ) {}

    async handle(command: AcceptSuggestionCommand): Promise<AcceptSuggestionResult> {
        const suggestion = await this.suggestionRepository.findById(command.suggestionId);
        if (!suggestion) {
            throw new Error(`Suggestion with ID ${command.suggestionId} not found`);
        }

        suggestion.accept();
        const savedSuggestion = await this.suggestionRepository.save(suggestion);

        if (!suggestion.seedId) {
            throw new Error("No se puede aceptar una sugerencia sin una semilla asociada");
        }

        const suggestionAcceptedEvent = new SuggestionAcceptedEvent(
            suggestion.id,
            suggestion.seedId,
            suggestion.name ?? undefined,
            suggestion.species ?? undefined,
            suggestion.image ?? undefined,
            suggestion.description ?? undefined,
            suggestion.sentOn ?? undefined,
            suggestion.tags ?? undefined,
            suggestion.sow ?? undefined,
            suggestion.family ?? undefined,
            suggestion.sfgOriginal ?? undefined,
            suggestion.sfgMultisow ?? undefined,
            suggestion.sfgClump ?? undefined,
            suggestion.germinationMin ?? undefined,
            suggestion.germinationMax ?? undefined
        );
        await this.eventBus.publish(suggestionAcceptedEvent);

        return AcceptSuggestionResult.fromDomain(savedSuggestion);
    }
}
