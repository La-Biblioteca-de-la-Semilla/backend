import { SuggestionRepository } from "../../domain/repositories/SuggestionRepository";
import { Suggestion, SuggestionStatus } from "../../domain/Suggestion";
import * as admin from "firebase-admin";
import { SuggestionMapper } from "./mappers/SuggestionMapper";
import { SuggestionEntity } from "./entities/SuggestionEntity";

export class FirestoreSuggestionRepository implements SuggestionRepository {
    private db = admin.firestore().collection("suggestions");

    async findAllByOrganizationIdWithPagination(
        id: string,
        offset: number,
        limit: number,
        status?: SuggestionStatus
    ): Promise<[Suggestion[], number]> {
        let query = this.db.where("organizationId", "==", id).orderBy("createdAt").offset(offset).limit(limit);

        // Aplicar filtro por estado si es necesario
        if (status) {
            query = query.where("status", "==", status);
        }

        const snapshot = await query.get();
        const totalSnapshot = status
            ? await this.db.where("status", "==", status).get()
            : await this.db.get();

        const suggestions = snapshot.docs.map((doc) => {
            const suggestionEntity = SuggestionEntity.fromFirestore(doc);
            return SuggestionMapper.toDomain(suggestionEntity);
        });

        return [suggestions, totalSnapshot.size];
    }

    async findById(id: string): Promise<Suggestion | null> {
        const doc = await this.db.doc(id).get();

        if (!doc.exists) return null;

        const suggestionEntity = SuggestionEntity.fromFirestore(doc);
        return SuggestionMapper.toDomain(suggestionEntity);
    }

    async save(suggestion: Suggestion): Promise<Suggestion> {
        const suggestionEntity = SuggestionMapper.toEntity(suggestion);

        if (suggestion.id) {
            // Si hay un ID, actualizar el documento existente
            await this.db.doc(suggestion.id).set(suggestionEntity.toFirestore());
        } else {
            // Si no hay ID, crear un nuevo documento
            const ref = await this.db.add(suggestionEntity.toFirestore());
            suggestionEntity.id = ref.id;
        }

        return SuggestionMapper.toDomain(suggestionEntity);
    }

    async delete(id: string): Promise<void> {
        const doc = await this.db.doc(id).get();

        if (!doc.exists) {
            throw new Error(`Suggestion with ID ${id} not found`);
        }

        await this.db.doc(id).delete();
    }
}