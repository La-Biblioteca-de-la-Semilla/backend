import { QueryHandler } from "../../../shared/application/QueryHandler";
import { ListImagesQuery } from "./ListImagesQuery";
import { ListImagesResult, ImageResult } from "./ListImagesResult";
import { ImageRepository } from "../../domain/repositories/ImageRepository";

export class ListImagesQueryHandler implements QueryHandler<ListImagesQuery, ListImagesResult> {
    constructor(private readonly repository: ImageRepository) {}

    async handle(query: ListImagesQuery): Promise<ListImagesResult> {
        const { seedId, page, limit } = query;
        const offset = (page - 1) * limit;

        const [images, total] = await this.repository.findWithPagination(offset, limit, seedId);

        const imageResults = images.map(image => {
            return new ImageResult(
                image.id,
                image.createdAt,
                image.createdBy,
                image.src,
                image.seedId
            );
        });

        return new ListImagesResult(imageResults, total, page, limit);
    }
}