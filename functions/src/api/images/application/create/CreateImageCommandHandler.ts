import { CommandHandler } from "../../../shared/application/CommandHandler";
import { CreateImageCommand } from "./CreateImageCommand";
import { Image } from "../../domain/Image";
import { ImageRepository } from "../../domain/repositories/ImageRepository";
import {ImageService} from "../../../shared/application/ImageService";
import {CreateImageResult} from "./CreateImageResult";

export class CreateImageCommandHandler implements CommandHandler<CreateImageCommand, CreateImageResult> {
    constructor(
        private readonly repository: ImageRepository,
        private readonly imageService: ImageService
    ) {}

    async handle(command: CreateImageCommand): Promise<CreateImageResult> {
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

        return CreateImageResult.fromDomain(savedImage);
    }
}