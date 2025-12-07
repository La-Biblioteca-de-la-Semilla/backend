
export class CreateMessageCommand {
    constructor(
        public readonly userId: string,
        public readonly chatId: string,
        public readonly text: string
    ) {}
}