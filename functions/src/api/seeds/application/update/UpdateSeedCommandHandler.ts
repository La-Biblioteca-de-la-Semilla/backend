import {UpdateSeedCommand} from "./UpdateSeedCommand";
import type {CommandHandler} from "../../../shared/application/CommandHandler";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";
import {CacheService} from "../../../shared/application/CacheService";
import {ImageService} from "../../../shared/application/ImageService";
import {SEEDS_LIST_CACHE_KEY} from "../../config/CacheKeys";
import {UpdateSeedResult} from "./UpdateSeedResult";

export class UpdateSeedCommandHandler implements CommandHandler<UpdateSeedCommand, UpdateSeedResult> {
    constructor(
        private readonly repository: SeedRepository,
        private readonly cacheService: CacheService,
        private readonly imageService: ImageService
    ) {
    }

    async handle(command: UpdateSeedCommand): Promise<UpdateSeedResult> {
        const seed = await this.repository.findById(command.id);

        if (!seed) {
            throw new Error(`Seed with ID ${command.id} not found`);
        }

        let processedImageUrl = seed.image
        if(command.image && command.image !== seed.image) {
            processedImageUrl = await this.imageService.process(
                command.image,
                `seed-${command.id}`
            );
        }

        seed.update({
            name: command.name,
            species: command.species,
            image: processedImageUrl,
            description: command.description,
            sentOn: command.sentOn,
            tags: command.tags,
            sow: command.sow,
            family: command.family,
            sfgOriginal: command.sfgOriginal,
            sfgMultisow: command.sfgMultisow,
            sfgClump: command.sfgClump,
            germinationMin: command.germinationMin,
            germinationMax: command.germinationMax,
        });

        const savedSeed = await this.repository.save(seed);

        this.cacheService.invalidate(SEEDS_LIST_CACHE_KEY);

        return UpdateSeedResult.fromDomain(savedSeed);
    }
}