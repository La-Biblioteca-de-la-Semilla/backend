import {Request, Response} from "express";
import { ListOrganizationQueryHandler } from "../../../application/list-organization/ListOrganizationQueryHandler";
import { ListOrganizationQuery } from "../../../application/list-organization/ListOrganizationQuery";
import {OrganizationAPIResponse} from "./OrganizationAPIResponse";
import {ListOrganizationAPIResponse} from "./ListOrganizationAPIResponse";

export class OrganizationController {
    constructor(
        private readonly listOrganizationQueryHandler: ListOrganizationQueryHandler
    ) {}

    async listOrganizations(_req: Request, res: Response) {
        try {
            const query = new ListOrganizationQuery();
            const result = await this.listOrganizationQueryHandler.handle(query);
            res.json(new ListOrganizationAPIResponse(result.organizations.map(org => new OrganizationAPIResponse(
                org.id,
                org.name,
                org.image,
                org.url,
                org.owner
            ))));
        } catch (error: any) {
            res.status(400).json({error: error.message});
        }
    }
}