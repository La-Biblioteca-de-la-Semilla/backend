export class ListMessagesQuery {
    constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly chatId: string,
        public readonly userId: string
    ) {}
}