import {DeleteSeedCommand} from "./DeleteSeedCommand";
import type {CommandHandler} from "../../../shared/application/CommandHandler";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";
import {CacheService} from "../../../shared/application/CacheService";
import {SEEDS_LIST_CACHE_KEY} from "../../config/CacheKeys";

export class DeleteSeedCommandHandler implements CommandHandler<DeleteSeedCommand, void> {
    constructor(
        private readonly repository: SeedRepository,
        private readonly cacheService: CacheService
    ) {
    }

    async handle(command: DeleteSeedCommand): Promise<void> {
        const seed = await this.repository.findById(command.id);
        if (!seed) {
            throw new Error(`Seed with ID ${command.id} not found`);
        }

        await this.repository.delete(command.id);
        this.cacheService.invalidate(SEEDS_LIST_CACHE_KEY);
    }
}
