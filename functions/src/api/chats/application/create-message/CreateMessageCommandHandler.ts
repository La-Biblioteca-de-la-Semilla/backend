import {CreateMessageCommand} from "./CreateMessageCommand";
import {CommandHandler} from "../../../shared/application/CommandHandler";
import {MessageRepository} from "../../domain/repositories/MessageRepository";
import {Message} from "../../domain/Message";
import {CreateMessageResult} from "./CreateMessageResult";
import {ChatRepository} from "../../domain/repositories/ChatRepository";

export class CreateMessageCommandHandler implements CommandHandler<CreateMessageCommand, CreateMessageResult> {

    constructor(
        private readonly repository: MessageRepository,
        private readonly chatRepository: ChatRepository
    ) {
    }

    async handle(command: CreateMessageCommand): Promise<CreateMessageResult> {
        const message = new Message(
            "",
            command.userId,
            command.text,
            new Date()
        );

        const savedMessage = await this.repository.save(command.chatId, message);

        const chat = await this.chatRepository.getById(command.chatId);
        if (chat) {
            chat.totalMessages = chat.totalMessages + 1;
            chat.lastMessage = savedMessage;
            chat.unreadBy = chat.participants.filter(participant => participant !== command.userId);

            await this.chatRepository.save(chat);
        }

        return CreateMessageResult.fromDomain(savedMessage);
    }
}