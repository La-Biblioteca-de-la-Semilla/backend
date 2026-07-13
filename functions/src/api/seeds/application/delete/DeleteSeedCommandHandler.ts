import {DeleteSeedCommand} from "./DeleteSeedCommand";
import type {CommandHandler} from "../../../shared/application/CommandHandler";
import type {SeedRepository} from "../../domain/repositories/SeedRepository";

export class DeleteSeedCommandHandler implements CommandHandler<DeleteSeedCommand, void> {
    constructor(
        private readonly repository: SeedRepository,
    ) {
    }

    async handle(command: DeleteSeedCommand): Promise<void> {
        const seed = await this.repository.findById(command.id);
        if (!seed) {
            throw new Error(`Seed with ID ${command.id} not found`);
        }

        await this.repository.delete(command.id);
    }
}
