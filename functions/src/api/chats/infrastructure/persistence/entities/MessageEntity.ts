
export class MessageEntity {
    constructor(
        public id: string,
        public from: string,
        public text: string,
        public sentAt: Date
    ) {
    }

    static fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot): MessageEntity {
        const data = snapshot.data();
        if (!data) {
            throw new Error("Document data is undefined");
        }
        return new MessageEntity(
            snapshot.id,
            data.from,
            data.text,
            data.sentAt.toDate()
        );
    }

    toFirestore(): Record<string, unknown> {
        return {
            id: this.id,
            from: this.from,
            text: this.text,
            sentAt: this.sentAt
        };
    }
}