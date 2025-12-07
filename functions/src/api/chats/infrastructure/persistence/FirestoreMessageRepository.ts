import {MessageRepository} from "../../domain/repositories/MessageRepository";
import { Message } from "../../domain/Message";
import * as admin from "firebase-admin";
import {MessageEntity} from "./entities/MessageEntity";
import {MessageMapper} from "./mappers/MessageMapper";

export class FirestoreMessageRepository implements MessageRepository {
    private db = admin.firestore().collection("chats");


    async getByChatIdWithPaginationOrderBySentAtDesc(offset: number, limit: number, chatId: string): Promise<[Message[], number]> {
        // Order by sentAt in descending order once (avoid duplicate orderBy on the same field)
        const query = this.db.doc(chatId).collection("messages").orderBy("sentAt", "desc");

        const snapshot = await query
            .offset(offset)
            .limit(limit)
            .get();

        const totalSnapshot = await this.db.doc(chatId).collection("messages").get();

        const messages = snapshot.docs.map(doc => {
            const messageEntity = MessageEntity.fromFirestore(doc);
            return MessageMapper.toDomain(messageEntity);
        });

        return [messages, totalSnapshot.size]

    }

    async save(chatId: string, message: Message): Promise<Message> {
        const messageEntity = MessageMapper.toEntity(message)
        const ref = await this.db.doc(chatId).collection("messages").add(messageEntity.toFirestore());
        messageEntity.id = ref.id;
        return MessageMapper.toDomain(messageEntity);
    }
}