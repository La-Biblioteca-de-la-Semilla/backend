import {SeedRepository} from "../../domain/repositories/SeedRepository";
import {Seed, SeedStatus} from "../../domain/Seed";
import * as admin from "firebase-admin";
import {SeedMapper} from "./mappers/SeedMapper";
import {SeedEntity} from "./entities/SeedEntity";

export class FirestoreSeedRepository implements SeedRepository {
    private db = admin.firestore().collection("seeds");

    async findAll(): Promise<Seed[]> {
        const snapshot = await this.db.get();
        return snapshot.docs.map(doc => {
            const seedEntity = SeedEntity.fromFirestore(doc);
            return SeedMapper.toDomain(seedEntity);
        });
    }
    async findAllByStatus(status: SeedStatus): Promise<Seed[]> {
        const snapshot = await this.db.where("status", "==", status).get();
        return snapshot.docs.map(doc => {
            const seedEntity = SeedEntity.fromFirestore(doc);
            return SeedMapper.toDomain(seedEntity);
        });
    }

    async findById(id: string): Promise<Seed | null> {
        const snapshot = await this.db.doc(id).get();
        if (!snapshot.exists) return null;
        const seedEntity = SeedEntity.fromFirestore(snapshot);
        return SeedMapper.toDomain(seedEntity);
    }

    async save(seed: Seed): Promise<Seed> {
        const seedEntity = SeedMapper.toEntity(seed);

        if (seedEntity.id && seedEntity.id.trim() !== "") {
            await this.db.doc(seedEntity.id).set(seedEntity.toFirestore(), {merge: true});
            return seed;
        }
        else {
            const ref = await this.db.add(seedEntity.toFirestore());
            seedEntity.id = ref.id;
            return SeedMapper.toDomain(seedEntity);
        }
    }

    async delete(id: string): Promise<void> {
        const doc = await this.db.doc(id).get();
        if (!doc.exists) {
            throw new Error(`Seed with ID ${id} not found`);
        }

        await this.db.doc(id).delete();
    }

}