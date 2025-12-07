import {Chat} from "../Chat";

export interface ChatRepository {
    save(chat: Chat): Promise<Chat>;
    getById(chatId: string): Promise<Chat | null>;
    getChatsByParticipant(userId: string): Promise<Chat[]>;
}