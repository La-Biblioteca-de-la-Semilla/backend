import { QueryHandler } from "../../../shared/application/QueryHandler";
import { GetOrganizationsByOwnerQuery } from "./GetOrganizationsByOwnerQuery";
import { GetOrganizationsByOwnerResult, OrganizationByOwnerResult } from "./GetOrganizationsByOwnerResult";
import type { OrganizationRepository } from "../../domain/OrganizationRepository";

export class GetOrganizationsByOwnerQueryHandler implements QueryHandler<GetOrganizationsByOwnerQuery, GetOrganizationsByOwnerResult> {
    constructor(private readonly repository: OrganizationRepository) {}

    async handle(query: GetOrganizationsByOwnerQuery): Promise<GetOrganizationsByOwnerResult> {
        const organizations = await this.repository.findAllByOwnerId(query.ownerId);
        const results = organizations.map(org => new OrganizationByOwnerResult(
            org.id,
            org.name,
            org.image,
            org.url,
            org.owner
        ));
        return new GetOrganizationsByOwnerResult(results);
    }
}
