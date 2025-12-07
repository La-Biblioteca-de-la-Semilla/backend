import {Image} from "../../domain/Image";

export class CreateImageResult {
    constructor(
        public readonly id: string,
        public readonly createdAt: Date,
        public readonly createdBy: string,
        public readonly src: string,
        public readonly seedId: string
    ) {}

    static fromDomain(image: Image) {
        return new CreateImageResult(
            image.id,
            image.createdAt,
            image.createdBy,
            image.src,
            image.seedId
        );
    }
}