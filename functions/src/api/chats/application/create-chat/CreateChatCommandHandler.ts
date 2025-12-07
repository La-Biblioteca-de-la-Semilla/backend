import {CommandHandler} from "../../../shared/application/CommandHandler";
import {CreateChatCommand} from "./CreateChatCommand";
import {Chat} from "../../domain/Chat";
import {ChatRepository} from "../../domain/repositories/ChatRepository";
import {CreateChatResult} from "./CreateChatResult";

export class CreateChatCommandHandler implements CommandHandler<CreateChatCommand, CreateChatResult> {
    constructor(
        private readonly repository: ChatRepository
    ) {
    }

    async handle(command: CreateChatCommand): Promise<CreateChatResult> {

        const participants = command.participants.includes(command.userId) ? command.participants : [...command.participants, command.userId];

        const chat: Chat = {
            id: "",
            participants: participants,
            lastMessage: null,
            totalMessages: 0,
            unreadBy: []
        };

        const savedChat =  await this.repository.save(chat);

        return CreateChatResult.fromDomain(savedChat);
    }
}