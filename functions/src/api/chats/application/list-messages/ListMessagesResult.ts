export class ListMessagesResult {
    constructor(
        public readonly messages: MessageResult[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number
    ) {}
}

export class MessageResult {
    constructor(
        public readonly id: string,
        public readonly from: string,
        public readonly text: string,
        public readonly sentAt: Date
    ) {}
}
