import {MessageAPIResponse} from "./MessageAPIResponse";

export class ChatAPIResponse {
    constructor(
        public readonly id: string,
        public readonly participants: string[],
        public readonly lastMessage: MessageAPIResponse | null,
        public readonly totalMessages: number,
        public readonly unreadBy: string[]
    ) {}
}