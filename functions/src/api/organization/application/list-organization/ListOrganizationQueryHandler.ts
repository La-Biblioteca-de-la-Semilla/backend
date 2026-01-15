import { QueryHandler } from "../../../shared/application/QueryHandler";
import { ListOrganizationQuery } from "./ListOrganizationQuery";
import { ListOrganizationResult, OrganizationResult } from "./ListOrganizationResult";
import type { OrganizationRepository } from "../../domain/OrganizationRepository";

export class ListOrganizationQueryHandler implements QueryHandler<ListOrganizationQuery, ListOrganizationResult> {
    constructor(private readonly repository: OrganizationRepository) {}

    async handle(): Promise<ListOrganizationResult> {
        const organizations = await this.repository.findAll();

        const results = organizations.map(org => new OrganizationResult(
            org.id,
            org.name,
            org.image,
            org.url,
            org.owner
        ));

        return new ListOrganizationResult(results);
    }
}
