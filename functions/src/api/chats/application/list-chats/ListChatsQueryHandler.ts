import {QueryHandler} from "../../../shared/application/QueryHandler";
import {ListChatsQuery} from "./ListChatsQuery";
import {ListChatsResult} from "./ListChatsResult";
import {ChatRepository} from "../../domain/repositories/ChatRepository";

export class ListChatsQueryHandler implements QueryHandler<ListChatsQuery, ListChatsResult> {
    constructor(private readonly repository: ChatRepository) {
    }

    async handle(query: ListChatsQuery): Promise<ListChatsResult> {
        const chats = await this.repository.getChatsByParticipant(query.userId);
        return ListChatsResult.fromDomain(chats);
    }
}