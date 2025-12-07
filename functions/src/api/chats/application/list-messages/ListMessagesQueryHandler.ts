import { QueryHandler } from "../../../shared/application/QueryHandler";
import { ListMessagesQuery } from "./ListMessagesQuery";
import {ListMessagesResult, MessageResult} from "./ListMessagesResult";
import { MessageRepository } from "../../domain/repositories/MessageRepository";

export class ListMessagesQueryHandler implements QueryHandler<ListMessagesQuery, ListMessagesResult> {
    constructor(private readonly repository: MessageRepository) {}

    async handle(query: ListMessagesQuery): Promise<ListMessagesResult> {
        const { chatId, page, limit } = query;
        const offset = (page - 1) * limit;

        const [messages, total ]= await this.repository.getByChatIdWithPaginationOrderBySentAtDesc(offset, limit, chatId);

        const messageResults = messages.map(message => {
            return new MessageResult(
                message.id,
                message.from,
                message.text,
                message.sentAt
            );
        });
        
        return new ListMessagesResult(messageResults, total, page, limit);
    }
}