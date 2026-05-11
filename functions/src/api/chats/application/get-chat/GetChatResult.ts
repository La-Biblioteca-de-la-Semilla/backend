import {Chat} from "../../domain/Chat";

export class GetChatResult {
    constructor(
        public readonly id: string,
        public readonly participants: string[],
        public readonly lastMessage: unknown,
        public readonly totalMessages: number,
        public readonly unreadBy: string[]
    ) {}

    static fromDomain(chat: Chat): GetChatResult {
        return new GetChatResult(
            chat.id,
            chat.participants,
            chat.lastMessage,
            chat.totalMessages,
            chat.unreadBy
        );
    }
}
