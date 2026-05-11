import {QueryHandler} from "../../../shared/application/QueryHandler";
import {GetChatQuery} from "./GetChatQuery";
import {GetChatResult} from "./GetChatResult";
import {ChatRepository} from "../../domain/repositories/ChatRepository";

export class GetChatQueryHandler implements QueryHandler<GetChatQuery, GetChatResult | null> {
    constructor(private readonly repository: ChatRepository) {}

    async handle(query: GetChatQuery): Promise<GetChatResult | null> {
        const chat = await this.repository.getById(query.chatId);
        if (!chat) return null;
        return GetChatResult.fromDomain(chat);
    }
}
