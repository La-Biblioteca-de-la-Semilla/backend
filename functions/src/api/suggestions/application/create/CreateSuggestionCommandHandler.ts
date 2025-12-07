import { CommandHandler } from "../../../shared/application/CommandHandler";
import { CreateSuggestionCommand } from "./CreateSuggestionCommand";
import { Suggestion } from "../../domain/Suggestion";
import { SuggestionRepository } from "../../domain/repositories/SuggestionRepository";
import {SeedRepository} from "../../../seeds/domain/repositories/SeedRepository";
import {CreateSuggestionResult} from "./CreateSuggestionResult";

export class CreateSuggestionCommandHandler implements CommandHandler<CreateSuggestionCommand, CreateSuggestionResult> {
    constructor(
        private readonly suggestionRepository: SuggestionRepository,
        private readonly seedRepository: SeedRepository
    ) {}

    async handle(command: CreateSuggestionCommand): Promise<CreateSuggestionResult> {
        const seed = await this.seedRepository.findById(command.seedId);
        if (!seed) {
            throw new Error(`Seed with ID ${command.seedId} not found`);
        }

        const suggestion = new Suggestion(
            "",
            command.seedId,
            seed.owner,
            new Date(),
            command.userId,
            "PENDING",
            command.name,
            command.species,
            command.image,
            command.description,
            command.sentOn,
            command.tags,
            command.sow,
            command.family,
            command.sfgOriginal,
            command.sfgMultisow,
            command.sfgClump,
            command.germinationMin,
            command.germinationMax
        );

        const result = await this.suggestionRepository.save(suggestion);

        return CreateSuggestionResult.fromDomain(result);
    }
}