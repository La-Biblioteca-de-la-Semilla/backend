import { OrganizationRepository } from "../../domain/OrganizationRepository";
import { Organization } from "../../domain/Organization";
import * as admin from "firebase-admin";
import { OrganizationMapper } from "./mappers/OrganizationMapper";
import { OrganizationEntity } from "./entities/OrganizationEntity";

export class FirestoreOrganizationRepository implements OrganizationRepository {

    private db = admin.firestore().collection("organizations");

    async findAll(): Promise<Organization[]> {
        const snapshot = await this.db.get();
        return snapshot.docs.map(doc => {
            const entity: OrganizationEntity = {
                id: doc.id,
                ...(doc.data() as any)
            } as OrganizationEntity;
            return OrganizationMapper.toDomain(entity);
        });
    }

    async findAllByOwnerId(userId: string): Promise<Organization[]> {
        const snapshot = await this.db.where("owner", "==", userId).get();
        return snapshot.docs.map(doc => {
            const entity: OrganizationEntity = {
                id: doc.id,
                ...(doc.data() as any)
            } as OrganizationEntity;
            return OrganizationMapper.toDomain(entity);
        });
    }
}