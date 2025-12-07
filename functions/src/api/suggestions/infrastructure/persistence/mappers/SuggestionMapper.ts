import {Suggestion, SuggestionStatus} from "../../../domain/Suggestion";
import { SuggestionEntity } from "../entities/SuggestionEntity";

export class SuggestionMapper {
    static toDomain(entity: SuggestionEntity): Suggestion {
        return new Suggestion(
            entity.id,
            entity.seedId,
            entity.organizationId,
            entity.createdAt,
            entity.createdBy,
            entity.status as SuggestionStatus,
            entity.name,
            entity.species,
            entity.image,
            entity.description,
            entity.sentOn,
            entity.tags,
            entity.sow,
            entity.family,
            entity.sfgOriginal,
            entity.sfgMultisow,
            entity.sfgClump,
            entity.germinationMin,
            entity.germinationMax
        );
    }

    static toEntity(domain: Suggestion): SuggestionEntity {
        return new SuggestionEntity(
            domain.id,
            domain.seedId,
            domain.organizationId,
            domain.createdAt,
            domain.createdBy,
            domain.status,
            domain.name,
            domain.species,
            domain.image,
            domain.description,
            domain.sentOn,
            domain.tags,
            domain.sow,
            domain.family,
            domain.sfgOriginal,
            domain.sfgMultisow,
            domain.sfgClump,
            domain.germinationMin,
            domain.germinationMax
        );
    }
}