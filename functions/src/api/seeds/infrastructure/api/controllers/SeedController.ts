import {Request, Response} from "express";
import {CreateSeedCommandHandler} from "../../../application/create/CreateSeedCommandHandler";
import {GetSeedQueryHandler} from "../../../application/get/GetSeedQueryHandler";
import {ListSeedsQueryHandler} from "../../../application/list/ListSeedsQueryHandler";
import {UpdateSeedCommandHandler} from "../../../application/update/UpdateSeedCommandHandler";
import {DeleteSeedCommandHandler} from "../../../application/delete/DeleteSeedCommandHandler";
import {CreateSeedCommand} from "../../../application/create/CreateSeedCommand";
import {GetSeedQuery} from "../../../application/get/GetSeedQuery";
import {UpdateSeedCommand} from "../../../application/update/UpdateSeedCommand";
import {DeleteSeedCommand} from "../../../application/delete/DeleteSeedCommand";
import {SeedAPIResponse} from "./SeedAPIResponse";
import {ListSeedAPIResponse} from "./ListSeedAPIResponse";
import {AuthenticatedRequest} from "../../../../shared/infrastructure/api/middleware/authMiddleware";
import {GetOrganizationsByOwnerQueryHandler} from "../../../../organization/application/get-organizations-by-owner/GetOrganizationsByOwnerQueryHandler";
import {GetOrganizationsByOwnerQuery} from "../../../../organization/application/get-organizations-by-owner/GetOrganizationsByOwnerQuery";

export class SeedController {
    constructor(
        private readonly createSeedCommandHandler: CreateSeedCommandHandler,
        private readonly getSeedQueryHandler: GetSeedQueryHandler,
        private readonly listSeedsQueryHandler: ListSeedsQueryHandler,
        private readonly updateSeedCommandHandler: UpdateSeedCommandHandler,
        private readonly deleteSeedCommandHandler: DeleteSeedCommandHandler,
        private readonly getOrganizationsByOwnerQueryHandler: GetOrganizationsByOwnerQueryHandler
    ) {
    }

    async createSeed(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            if (!authReq.user) {
                res.status(401).json({error: "Authentication required"});
                return;
            }

            const orgsResult = await this.getOrganizationsByOwnerQueryHandler.handle(new GetOrganizationsByOwnerQuery(authReq.user.uid));
            if (orgsResult.organizations.length === 0) {
                res.status(403).json({error: "No organization found for this user"});
                return;
            }

            const organizationId = orgsResult.organizations[0].id;

            const command = new CreateSeedCommand(
                req.body.id,
                req.body.name,
                req.body.species,
                req.body.image,
                organizationId,
                req.body.description,
                req.body.sentOn,
                req.body.tags,
                req.body.sow,
                req.body.family,
                req.body.sfgOriginal,
                req.body.sfgMultisow,
                req.body.sfgClump,
                req.body.germinationMin,
                req.body.germinationMax
            );

            const result = await this.createSeedCommandHandler.handle(command);
            res.json(new SeedAPIResponse(
                result.id,
                result.name,
                result.species,
                result.image,
                result.owner,
                result.description,
                result.sentOn,
                result.tags,
                result.sow,
                result.family,
                result.sfgOriginal,
                result.sfgMultisow,
                result.sfgClump,
                result.germinationMin,
                result.germinationMax
            ));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(400).json({error: message});
        }
    }


    async getSeed(req: Request, res: Response): Promise<void> {
        try {
            const query = new GetSeedQuery(req.params.id);
            const result = await this.getSeedQueryHandler.handle(query);

            if (!result) {
                res.status(404).json({error: `Seed with ID ${req.params.id} not found`});
                return;
            }

            res.json(new SeedAPIResponse(
                result.id,
                result.name,
                result.species,
                result.image,
                result.owner,
                result.description,
                result.sentOn,
                result.tags,
                result.sow,
                result.family,
                result.sfgOriginal,
                result.sfgMultisow,
                result.sfgClump,
                result.germinationMin,
                result.germinationMax
            ));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(500).json({error: message});
        }
    }


    async listSeeds(_req: Request, res: Response): Promise<void> {
        try {
            const result = await this.listSeedsQueryHandler.handle();
            res.json(new ListSeedAPIResponse(result.seeds.map(seed => new SeedAPIResponse(
                seed.id,
                seed.name,
                seed.species,
                seed.image,
                seed.owner,
                seed.description,
                seed.sentOn,
                seed.tags,
                seed.sow,
                seed.family,
                seed.sfgOriginal,
                seed.sfgMultisow,
                seed.sfgClump,
                seed.germinationMin,
                seed.germinationMax
            ))));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(500).json({error: message});
        }
    }


    async updateSeed(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            if (!authReq.user) {
                res.status(401).json({error: "Authentication required"});
                return;
            }

            const seed = await this.getSeedQueryHandler.handle(new GetSeedQuery(req.params.id));
            if (!seed) {
                res.status(404).json({error: `Seed with ID ${req.params.id} not found`});
                return;
            }

            const userOrgs = await this.getOrganizationsByOwnerQueryHandler.handle(new GetOrganizationsByOwnerQuery(authReq.user.uid));
            const isOwner = userOrgs.organizations.some(org => org.id === seed.owner);
            if (!isOwner) {
                res.status(403).json({error: "You don't have permission to update this seed"});
                return;
            }

            const command = new UpdateSeedCommand(
                req.params.id,
                req.body.name,
                req.body.species,
                req.body.image,
                req.body.description,
                req.body.sentOn,
                req.body.tags,
                req.body.sow,
                req.body.family,
                req.body.sfgOriginal,
                req.body.sfgMultisow,
                req.body.sfgClump,
                req.body.germinationMin,
                req.body.germinationMax
            );

            const response = await this.updateSeedCommandHandler.handle(command);
            res.status(204).send(new SeedAPIResponse(
                response.id,
                response.name,
                response.species,
                response.image,
                response.owner,
                response.description,
                response.sentOn,
                response.tags,
                response.sow,
                response.family,
                response.sfgOriginal,
                response.sfgMultisow,
                response.sfgClump,
                response.germinationMin,
                response.germinationMax
            ));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            if (message.includes("not found")) {
                res.status(404).json({error: message});
            } else {
                res.status(400).json({error: message});
            }
        }
    }


    async deleteSeed(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            if (!authReq.user) {
                res.status(401).json({error: "Authentication required"});
                return;
            }

            const seed = await this.getSeedQueryHandler.handle(new GetSeedQuery(req.params.id));
            if (!seed) {
                res.status(404).json({error: `Seed with ID ${req.params.id} not found`});
                return;
            }

            const userOrgs = await this.getOrganizationsByOwnerQueryHandler.handle(new GetOrganizationsByOwnerQuery(authReq.user.uid));
            const isOwner = userOrgs.organizations.some(org => org.id === seed.owner);
            if (!isOwner) {
                res.status(403).json({error: "You don't have permission to delete this seed"});
                return;
            }

            const command = new DeleteSeedCommand(req.params.id);
            await this.deleteSeedCommandHandler.handle(command);

            res.status(204).send();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            if (message.includes("not found")) {
                res.status(404).json({error: message});
            } else {
                res.status(500).json({error: message});
            }
        }
    }
}
