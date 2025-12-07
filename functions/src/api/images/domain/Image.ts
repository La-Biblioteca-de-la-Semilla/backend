export class Image {
    constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly src: string,
        public readonly seedId: string
    ) {}
}