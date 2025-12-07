export class CreateChatCommand {
    constructor(
        public readonly userId: string,
        public readonly participants: string[],
        public readonly lastMessage: string = "",
        public readonly totalMessages: number = 0,
        public readonly unreadBy: string[] = []
    ) {}
}