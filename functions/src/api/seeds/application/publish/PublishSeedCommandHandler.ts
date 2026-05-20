import {PublishSeedCommand} from "./PublishSeedCommand";
import type {CommandHandler} from "../../../shared/application/CommandHandler";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";
import {CacheService} from "../../../shared/application/CacheService";
import {SEEDS_LIST_CACHE_KEY} from "../../config/CacheKeys";
import {PublishSeedResult} from "./PublishSeedResult";

export class PublishSeedCommandHandler implements CommandHandler<PublishSeedCommand, PublishSeedResult> {
    constructor(
        private readonly repository: SeedRepository,
        private readonly cacheService: CacheService
    ) {
    }

    async handle(command: PublishSeedCommand): Promise<PublishSeedResult> {
        const seed = await this.repository.findById(command.id);
        if (!seed) {
            throw new Error(`Seed with ID ${command.id} not found`);
        }

        seed.publish();

        const savedSeed = await this.repository.save(seed);

        this.cacheService.invalidate(SEEDS_LIST_CACHE_KEY);

        return PublishSeedResult.fromDomain(savedSeed);
    }
}
