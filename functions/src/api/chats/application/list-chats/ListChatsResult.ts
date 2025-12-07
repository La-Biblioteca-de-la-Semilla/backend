import {Chat} from "../../domain/Chat";

export class ListChatsResult {
    constructor(
        public readonly chats: ChatResult[]
    ) {}

    static fromDomain(chats: Chat[]): ListChatsResult {
        const chatResults = chats.map(chat => 
            new ChatResult(
                chat.id,
                chat.participants,
                chat.lastMessage,
                chat.totalMessages,
                chat.unreadBy
            )
        );
        
        return new ListChatsResult(chatResults);
    }
}

export class ChatResult {
    constructor(
        public readonly id: string,
        public readonly participants: string[],
        public readonly lastMessage: MessageResult | null,
        public readonly totalMessages: number,
        public readonly unreadBy: string[]
    ) {}
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