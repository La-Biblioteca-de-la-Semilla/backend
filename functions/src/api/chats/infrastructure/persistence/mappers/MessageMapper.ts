import {MessageEntity} from "../entities/MessageEntity";
import {Message} from "../../../domain/Message";

export class MessageMapper {

    static toDomain(entity: MessageEntity): Message {
        return new Message(
            entity.id,
            entity.from,
            entity.text,
            entity.sentAt
        );
    }

    static toEntity(domain: Message): MessageEntity {
        return new MessageEntity(
            domain.id,
            domain.from,
            domain.text,
            domain.sentAt
        );
    }
}