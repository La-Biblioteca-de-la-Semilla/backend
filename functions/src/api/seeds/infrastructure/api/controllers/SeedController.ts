import {Request, Response} from "express";
import {CreateSeedCommandHandler} from "../../../application/create/CreateSeedCommandHandler";
import {GetSeedQueryHandler} from "../../../application/get/GetSeedQueryHandler";
import {ListSeedsQueryHandler} from "../../../application/list/ListSeedsQueryHandler";
import {UpdateSeedCommandHandler} from "../../../application/update/UpdateSeedCommandHandler";
import {DeleteSeedCommandHandler} from "../../../application/delete/DeleteSeedCommandHandler";
import {CreateSeedCommand} from "../../../application/create/CreateSeedCommand";
import {GetSeedQuery} from "../../../application/get/GetSeedQuery";
import {ListSeedsQuery} from "../../../application/list/ListSeedsQuery";
import {UpdateSeedCommand} from "../../../application/update/UpdateSeedCommand";
import {DeleteSeedCommand} from "../../../application/delete/DeleteSeedCommand";
import {SeedAPIResponse} from "./SeedAPIResponse";
import {ListSeedAPIResponse} from "./ListSeedAPIResponse";

export class SeedController {
    constructor(
        private readonly createSeedCommandHandler: CreateSeedCommandHandler,
        private readonly getSeedQueryHandler: GetSeedQueryHandler,
        private readonly listSeedsQueryHandler: ListSeedsQueryHandler,
        private readonly updateSeedCommandHandler: UpdateSeedCommandHandler,
        private readonly deleteSeedCommandHandler: DeleteSeedCommandHandler
    ) {
    }

    async createSeed(req: Request, res: Response): Promise<void> {
        try {
            // TODO: Comprobar que req.body.owner es una organización que pertenece al usuario autenticado

            const command = new CreateSeedCommand(
                req.body.id,
                req.body.name,
                req.body.species,
                req.body.image,
                req.body.description,
                req.body.sentOn,
                req.body.owner,
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
        } catch (error: any) {
            res.status(400).json({error: error.message});
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
        } catch (error: any) {
            res.status(500).json({error: error.message});
        }
    }


    async listSeeds(_req: Request, res: Response): Promise<void> {
        try {
            const query = new ListSeedsQuery();
            const result = await this.listSeedsQueryHandler.handle(query);
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
        } catch (error: any) {
            res.status(500).json({error: error.message});
        }
    }


    async updateSeed(req: Request, res: Response): Promise<void> {
        try {
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
        } catch (error: any) {
            if (error.message.includes("not found")) {
                res.status(404).json({error: error.message});
            } else {
                res.status(400).json({error: error.message});
            }
        }
    }


    async deleteSeed(req: Request, res: Response): Promise<void> {
        try {
            const command = new DeleteSeedCommand(req.params.id);
            await this.deleteSeedCommandHandler.handle(command);

            res.status(204).send(); // No content
        } catch (error: any) {
            if (error.message.includes("not found")) {
                res.status(404).json({error: error.message});
            } else {
                res.status(500).json({error: error.message});
            }
        }
    }
}
