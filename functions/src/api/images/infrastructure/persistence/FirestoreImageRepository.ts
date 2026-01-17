import { ImageRepository } from "../../domain/repositories/ImageRepository";
import { Image } from "../../domain/Image";
import * as admin from "firebase-admin";
import { ImageMapper } from "./mappers/ImageMapper";
import { ImageEntity } from "./entities/ImageEntity";

export class FirestoreImageRepository implements ImageRepository {

    private db = admin.firestore().collection("images");

    async findWithPagination(offset: number, limit: number, seedId?: string): Promise<[Image[], number]> {
        let query = this.db.orderBy("createdAt");

        if (seedId) {
            query = query.where("seedId", "==", seedId);
        }

        const snapshot = await query
            .offset(offset)
            .limit(limit)
            .get();

        const totalSnapshot = seedId
            ? await this.db.where("seedId", "==", seedId).get()
            : await this.db.get();

        const images = snapshot.docs.map(doc => {
            const imageEntity = ImageEntity.fromFirestore(doc);
            return ImageMapper.toDomain(imageEntity);
        });

        return [images, totalSnapshot.size];
    }

    async findById(id: string): Promise<Image> {
        const doc = await this.db.doc(id).get();
        if (!doc.exists) {
            throw new Error(`Image with ID ${id} not found`);
        }

        const imageEntity = ImageEntity.fromFirestore(doc);
        return ImageMapper.toDomain(imageEntity);
    }

    async save(image: Image): Promise<Image> {
        const imageEntity = ImageMapper.toEntity(image);
        const ref = await this.db.add(imageEntity.toFirestore());
        imageEntity.id = ref.id;
        return ImageMapper.toDomain(imageEntity);
    }

    async countBySeedId(seedId: string): Promise<number> {
        const snapshot = await this.db.where("seedId", "==", seedId).count().get();
        return snapshot.data().count;
    }

    async delete(id: string): Promise<void> {
        const doc = await this.db.doc(id).get();
        if (!doc.exists) {
            throw new Error(`Image with ID ${id} not found`);
        }

        await this.db.doc(id).delete();
    }
}