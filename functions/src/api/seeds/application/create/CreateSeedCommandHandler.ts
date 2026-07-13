import {CommandHandler} from "../../../shared/application/CommandHandler";
import {CreateSeedCommand} from "./CreateSeedCommand";
import {Seed} from "../../domain/Seed";
import {SeedRepository} from "../../domain/repositories/SeedRepository";
import {ImageService} from "../../../shared/application/ImageService";
import {CreateSeedResult} from "./CreateSeedResult";

export class CreateSeedCommandHandler implements CommandHandler<CreateSeedCommand, CreateSeedResult> {
    constructor(
        private readonly repository: SeedRepository,
        private readonly imageService: ImageService
    ) {
    }

    async handle(command: CreateSeedCommand): Promise<CreateSeedResult> {

        const processedImageUrl = await this.imageService.process(
            command.image,
            `seed-${command.id}`
        );

        const seed = new Seed(
            command.id,
            command.name,
            command.species,
            processedImageUrl,
            command.owner,
            command.description,
            command.sentOn,
            command.tags,
            command.sow,
            command.family,
            command.sfgOriginal,
            command.sfgMultisow,
            command.sfgClump,
            command.germinationMin,
            command.germinationMax,
            "draft"
        );

        const savedSeed = await this.repository.save(seed);

        return CreateSeedResult.fromDomain(savedSeed);
    }
}