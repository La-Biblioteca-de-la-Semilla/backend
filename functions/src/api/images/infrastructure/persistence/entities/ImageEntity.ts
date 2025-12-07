export class ImageEntity {
    constructor(
        public id: string,
        public createdAt: Date,
        public createdBy: string,
        public src: string,
        public seedId: string
    ) {}

    static fromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot): ImageEntity {
        const data = snapshot.data();
        if (!data) {
            throw new Error("Document data is undefined");
        }

        return new ImageEntity(
            snapshot.id,
            data.createdAt,
            data.createdBy,
            data.src,
            data.seedId
        );
    }

    toFirestore(): Record<string, unknown> {
        return {
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            src: this.src,
            seedId: this.seedId
        };
    }
}