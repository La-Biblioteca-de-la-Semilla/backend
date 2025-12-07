import { Image } from "../../../domain/Image";
import { ImageEntity } from "../entities/ImageEntity";

export class ImageMapper {

    static toDomain(entity: ImageEntity): Image {
        return new Image(
            entity.id,
            entity.createdAt,
            entity.createdBy,
            entity.src,
            entity.seedId
        );
    }

    static toEntity(domain: Image): ImageEntity {
        return new ImageEntity(
            domain.id,
            domain.createdAt,
            domain.createdBy,
            domain.src,
            domain.seedId
        );
    }
}