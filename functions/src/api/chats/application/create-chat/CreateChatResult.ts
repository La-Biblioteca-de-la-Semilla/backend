import {Chat} from "../../domain/Chat";

export class CreateChatResult {
    constructor(
        public readonly id: string,
        public readonly participants: string[],
        public readonly lastMessage: MessageResult | null,
        public readonly totalMessages: number,
        public readonly unreadBy: string[]
    ) {}

    static fromDomain(chat: Chat) {
        return new CreateChatResult(
            chat.id,
            chat.participants,
            chat.lastMessage,
            chat.totalMessages,
            chat.unreadBy
        );
    }
}

export class MessageResult {
    constructor(
        public readonly id: string,
        public readonly from: string,
        public readonly text: string,
        public readonly sentAt: Date
    ) {
    }
}

