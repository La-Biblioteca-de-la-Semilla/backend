import {Message} from "./Message";

export class Chat {
    constructor(
        public readonly id: string,
        public readonly participants: string[],
        public lastMessage: Message | null,
        public totalMessages: number,
        public unreadBy: string[]
    ) {}
}
