import {MessageEntity} from "./MessageEntity";

export class ChatEntity {
    constructor(
        public id: string,
        public participants: string[],
        public lastMessage: MessageEntity | null,
        public totalMessages: number,
        public unreadBy: string[]
    ) {}

    static fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot): ChatEntity {
        const data = snapshot.data();
        if (!data) {
            throw new Error("Document data is undefined")
        }
        const lastMessageData = data.lastMessage;
        const lastMessage = lastMessageData ? new MessageEntity(
            lastMessageData.id,
            lastMessageData.from,
            lastMessageData.text,
            lastMessageData.sentAt?.toDate ? lastMessageData.sentAt.toDate() : lastMessageData.sentAt
        ) : null;
        return new ChatEntity(
            snapshot.id,
            data.participants,
            lastMessage,
            data.totalMessages,
            data.unreadBy
        );
    }

    toFirestore(): Record<string, unknown> {
        return {
            participants: this.participants,
            lastMessage: this.lastMessage ? this.lastMessage.toFirestore() : null,
            totalMessages: this.totalMessages,
            unreadBy: this.unreadBy
        }
    }
}