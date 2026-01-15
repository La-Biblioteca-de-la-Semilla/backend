import {Request, Response} from "express";
import { ListOrganizationQueryHandler } from "../../../application/list-organization/ListOrganizationQueryHandler";
import {OrganizationAPIResponse} from "./OrganizationAPIResponse";
import {ListOrganizationAPIResponse} from "./ListOrganizationAPIResponse";

export class OrganizationController {
    constructor(
        private readonly listOrganizationQueryHandler: ListOrganizationQueryHandler
    ) {}

    async listOrganizations(_req: Request, res: Response) {
        try {
            const result = await this.listOrganizationQueryHandler.handle();
            res.json(new ListOrganizationAPIResponse(result.organizations.map(org => new OrganizationAPIResponse(
                org.id,
                org.name,
                org.image,
                org.url,
                org.owner
            ))));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(400).json({error: message});
        }
    }
}