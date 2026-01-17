import { CommandHandler } from "../../../shared/application/CommandHandler";
import { CreateImageCommand } from "./CreateImageCommand";
import { Image } from "../../domain/Image";
import { ImageRepository } from "../../domain/repositories/ImageRepository";
import {ImageService} from "../../../shared/application/ImageService";
import {CreateImageResult} from "./CreateImageResult";
import {EventBus} from "../../../shared/domain/events/EventBus";
import {FirstSeedImageCreatedEvent} from "../../domain/events/FirstSeedImageCreatedEvent";

export class CreateImageCommandHandler implements CommandHandler<CreateImageCommand, CreateImageResult> {
    constructor(
        private readonly repository: ImageRepository,
        private readonly imageService: ImageService,
        private readonly eventBus: EventBus
    ) {}

    async handle(command: CreateImageCommand): Promise<CreateImageResult> {
        const imagesCount = await this.repository.countBySeedId(command.seedId);

        const processedImageUrl = await this.imageService.process(
            command.src,
            `seed-image-${command.seedId}`
        );
        
        const image = new Image(
            "",
            command.createdAt,
            command.createdBy,
            processedImageUrl,
            command.seedId
        );

        const savedImage = await this.repository.save(image);

        if (imagesCount === 0) {
            await this.eventBus.publish(new FirstSeedImageCreatedEvent(
                savedImage.id,
                savedImage.seedId,
                savedImage.src
            ));
        }

        return CreateImageResult.fromDomain(savedImage);
    }
}