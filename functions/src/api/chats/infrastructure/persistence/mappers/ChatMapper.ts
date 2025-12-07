import {ChatEntity} from "../entities/ChatEntity";
import {Chat} from "../../../domain/Chat";
import {MessageMapper} from "./MessageMapper";


export class ChatMapper {
    static toDomain(entity: ChatEntity) {
        return new Chat(
            entity.id,
            entity.participants,
            entity.lastMessage ? MessageMapper.toDomain(entity.lastMessage) : null,
            entity.totalMessages,
            entity.unreadBy
        )
    }

    static toEntity(domain: Chat) {
        return new ChatEntity(
            domain.id,
            domain.participants,
            domain.lastMessage ? MessageMapper.toEntity(domain.lastMessage) : null,
            domain.totalMessages,
            domain.unreadBy
        )
    }

}