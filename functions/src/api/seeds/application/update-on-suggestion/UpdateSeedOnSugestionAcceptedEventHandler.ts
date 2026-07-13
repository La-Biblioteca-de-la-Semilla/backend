import {UpdateSeedCommandHandler} from "../update/UpdateSeedCommandHandler";
import {DomainEvent} from "../../../shared/domain/events/DomainEvent";
import {SuggestionAcceptedEvent} from "../../../suggestions/domain/events/SuggestionAcceptedEvent";
import {UpdateSeedCommand} from "../update/UpdateSeedCommand";


export class UpdateSeedOnSuggestionAcceptedEventHandler {
    constructor(
        private readonly updateSeedCommandHandler: UpdateSeedCommandHandler,
    ) {}

    async handle(event: DomainEvent): Promise<void> {
        if (event.eventName !== SuggestionAcceptedEvent.EVENT_NAME) {
            return;
        }

        const suggestionEvent = event as SuggestionAcceptedEvent;

        const updateSeedCommand = new UpdateSeedCommand(
            suggestionEvent.seedId,
            suggestionEvent.name,
            suggestionEvent.species,
            suggestionEvent.image,
            suggestionEvent.description,
            suggestionEvent.sentOn,
            suggestionEvent.tags,
            suggestionEvent.sow,
            suggestionEvent.family,
            suggestionEvent.sfgOriginal,
            suggestionEvent.sfgMultisow,
            suggestionEvent.sfgClump,
            suggestionEvent.germinationMin,
            suggestionEvent.germinationMax
        );

        await this.updateSeedCommandHandler.handle(updateSeedCommand);
    }
}
