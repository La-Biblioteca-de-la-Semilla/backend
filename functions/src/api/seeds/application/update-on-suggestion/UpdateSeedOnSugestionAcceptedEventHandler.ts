import {UpdateSeedCommandHandler} from "../update/UpdateSeedCommandHandler";
import {DomainEvent} from "../../../shared/domain/events/DomainEvent";
import {SuggestionAcceptedEvent} from "../../../suggestions/domain/events/SuggestionAcceptedEvent";
import {UpdateSeedCommand} from "../update/UpdateSeedCommand";
import {SEEDS_LIST_CACHE_KEY} from "../../config/CacheKeys";
import {CacheService} from "../../../shared/application/CacheService";


export class UpdateSeedOnSuggestionAcceptedEventHandler {
    constructor(
        private readonly updateSeedCommandHandler: UpdateSeedCommandHandler,
        private readonly cacheService: CacheService
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

        this.cacheService.invalidate(SEEDS_LIST_CACHE_KEY);
    }
}
