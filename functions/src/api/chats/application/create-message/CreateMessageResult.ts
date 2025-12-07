import {Message} from "../../domain/Message";

export class CreateMessageResult {
    constructor(
        public readonly id: string,
        public readonly from: string,
        public readonly text: string,
        public readonly sentAt: Date
    ) {}

    static fromDomain(message: Message) {
        return new CreateMessageResult(
            message.id,
            message.from,
            message.text,
            message.sentAt
        );
    }
}