import {ChatRepository} from "../../domain/repositories/ChatRepository";
import {Chat} from "../../domain/Chat";
import * as admin from "firebase-admin";
import {ChatMapper} from "./mappers/ChatMapper";
import {ChatEntity} from "./entities/ChatEntity";

export class FirestoreChatRepository implements ChatRepository {
    private db = admin.firestore().collection("chats");

    async save(chat: Chat): Promise<Chat> {
        const chatEntity = ChatMapper.toEntity(chat);

        if (chat.id && chat.id.trim() !== "") {
            await this.db.doc(chat.id).set(chatEntity.toFirestore(), { merge: true });
            return chat;
        } else {
            const ref = await this.db.add(chatEntity.toFirestore());
            chatEntity.id = ref.id;
            return ChatMapper.toDomain(chatEntity);
        }
    }

    async getChatsByParticipant(userId: string): Promise<Chat[]> {
        const snapshot = await this.db
            .where("participants", "array-contains", userId)
            .get();

        return snapshot.docs.map(doc => {
            const chatEntity = ChatEntity.fromFirestore(doc);
            return ChatMapper.toDomain(chatEntity);
        });
    }

    async getById(id: string): Promise<Chat | null> {
        const snapshot = await this.db.doc(id).get();
        if (!snapshot.exists) return null;

        const chatEntity = ChatEntity.fromFirestore(snapshot);
        return ChatMapper.toDomain(chatEntity);
    }
}