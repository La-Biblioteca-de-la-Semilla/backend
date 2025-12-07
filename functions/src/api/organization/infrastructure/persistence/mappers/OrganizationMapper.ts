import { Organization } from "../../../domain/Organization";
import { OrganizationEntity } from "../entities/OrganizationEntity";

export class OrganizationMapper {
    static toDomain(entity: OrganizationEntity): Organization {
        return new Organization(
            entity.id,
            entity.name,
            entity.image,
            entity.url,
            entity.owner
        );
    }

    static toEntity(organization: Organization): OrganizationEntity {
        return {
            id: organization.id,
            name: organization.name,
            image: organization.image,
            url: organization.url,
            owner: organization.owner
        };
    }
}