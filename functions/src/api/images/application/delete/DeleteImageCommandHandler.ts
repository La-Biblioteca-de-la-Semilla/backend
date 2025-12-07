import { CommandHandler } from "../../../shared/application/CommandHandler";
import { DeleteImageCommand } from "./DeleteImageCommand";
import { ImageRepository } from "../../domain/repositories/ImageRepository";

export class DeleteImageCommandHandler implements CommandHandler<DeleteImageCommand, void> {
    constructor(private readonly repository: ImageRepository) {}

    async handle(command: DeleteImageCommand): Promise<void> {
        const image = await this.repository.findById(command.id);

        if(image.createdBy !== command.userId) {
            throw new Error("User not authorized to delete this image");
        }

        await this.repository.delete(command.id);
    }
}