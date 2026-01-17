import {UpdateSeedCommandHandler} from "../update/UpdateSeedCommandHandler";
import {DomainEvent} from "../../../shared/domain/events/DomainEvent";
import {FirstSeedImageCreatedEvent} from "../../../images/domain/events/FirstSeedImageCreatedEvent";
import {UpdateSeedCommand} from "../update/UpdateSeedCommand";
import {SeedRepository} from "../../domain/repositories/SeedRepository";

export class UpdateSeedOnFirstImageCreatedEventHandler {
    private readonly DEFAULT_IMAGE_URL = "https://labibliotecadelasemilla.org/og-image.jpg";

    constructor(
        private readonly updateSeedCommandHandler: UpdateSeedCommandHandler,
        private readonly seedRepository: SeedRepository
    ) {}

    async handle(event: DomainEvent): Promise<void> {
        if (event.eventName !== FirstSeedImageCreatedEvent.EVENT_NAME) {
            return;
        }

        const firstImageEvent = event as FirstSeedImageCreatedEvent;

        const seed = await this.seedRepository.findById(firstImageEvent.seedId);

        if (!seed) {
            return;
        }

        if (seed.image === this.DEFAULT_IMAGE_URL) {
            const updateSeedCommand = new UpdateSeedCommand(
                seed.id,
                seed.name,
                seed.species,
                firstImageEvent.imageUrl,
                seed.description ?? undefined,
                seed.sentOn ?? undefined,
                seed.tags ?? undefined,
                seed.sow ?? undefined,
                seed.family ?? undefined,
                seed.sfgOriginal ?? undefined,
                seed.sfgMultisow ?? undefined,
                seed.sfgClump ?? undefined,
                seed.germinationMin ?? undefined,
                seed.germinationMax ?? undefined
            );

            await this.updateSeedCommandHandler.handle(updateSeedCommand);
        }
    }
}
