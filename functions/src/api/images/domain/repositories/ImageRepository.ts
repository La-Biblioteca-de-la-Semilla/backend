import { Image } from "../Image";

export interface ImageRepository {
    findWithPagination(offset: number, limit: number, seedId?: string): Promise<[Image[], number]>;
    findById(id: string): Promise<Image>;
    save(image: Image): Promise<Image>;
    delete(id: string): Promise<void>;
}
