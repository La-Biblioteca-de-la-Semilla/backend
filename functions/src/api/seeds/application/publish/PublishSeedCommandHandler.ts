import {PublishSeedCommand} from "./PublishSeedCommand";
import type {CommandHandler} from "../../../shared/application/CommandHandler";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";
import {PublishSeedResult} from "./PublishSeedResult";

export class PublishSeedCommandHandler implements CommandHandler<PublishSeedCommand, PublishSeedResult> {
    constructor(
        private readonly repository: SeedRepository,
    ) {
    }

    async handle(command: PublishSeedCommand): Promise<PublishSeedResult> {
        const seed = await this.repository.findById(command.id);
        if (!seed) {
            throw new Error(`Seed with ID ${command.id} not found`);
        }

        seed.publish();

        const savedSeed = await this.repository.save(seed);

        return PublishSeedResult.fromDomain(savedSeed);
    }
}
