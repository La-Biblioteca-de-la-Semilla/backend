export class ListImagesQuery {
    constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly seedId?: string
    ) {}
}
