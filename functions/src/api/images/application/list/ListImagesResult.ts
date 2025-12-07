export class ListImagesResult {
    constructor(
        public readonly images: ImageResult[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number
    ) {}
}


export class ImageResult {
    constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly src: string,
        public readonly seedId: string
    ) {}
}