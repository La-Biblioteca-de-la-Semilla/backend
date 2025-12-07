import {Message} from "../Message";

export interface MessageRepository {
    getByChatIdWithPaginationOrderBySentAtDesc(offset: number, limit: number, chatId: string): Promise<[Message[], number]>;
    save(chatId: string, message: Message): Promise<Message>;
}