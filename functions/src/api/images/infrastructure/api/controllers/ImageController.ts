import { Request, Response } from "express";
import { CreateImageCommandHandler } from "../../../application/create/CreateImageCommandHandler";
import { ListImagesQueryHandler } from "../../../application/list/ListImagesQueryHandler";
import { DeleteImageCommandHandler } from "../../../application/delete/DeleteImageCommandHandler";
import { CreateImageCommand } from "../../../application/create/CreateImageCommand";
import { ListImagesQuery } from "../../../application/list/ListImagesQuery";
import { DeleteImageCommand } from "../../../application/delete/DeleteImageCommand";
import {AuthenticatedRequest} from "../../../../shared/infrastructure/api/middleware/authMiddleware";
import {ImageAPIResponse} from "./ImageAPIResponse";
import {ListImageAPIResponse} from "./ListImageAPIResponse";
import {Pagination} from "../../../../shared/infrastructure/api/Pagination";

export class ImageController {
    constructor(
        private readonly createImageCommandHandler: CreateImageCommandHandler,
        private readonly listImagesQueryHandler: ListImagesQueryHandler,
        private readonly deleteImageCommandHandler: DeleteImageCommandHandler
    ) {}


    async createImage(req: Request, res: Response): Promise<void> {

        const authReq = req as AuthenticatedRequest;
        const owner = authReq.user?.uid || "";

        try {
            const command = new CreateImageCommand(
                req.body.src,
                req.body.seedId,
                new Date(),
                owner,
            );

            const result = await this.createImageCommandHandler.handle(command);
            res.status(201).send(new ImageAPIResponse(result.id, result.createdAt, result.createdBy, result.src, result.seedId));
        } catch (reason: unknown) {
            res.status(400).json({ error: reason });
        }
    }


    async listImages(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const seedId = req.query.seedId as string | undefined;

            // Validar parámetros de paginación
            if (page < 1 || limit < 1) {
                res.status(400).json({ error: "Los parámetros 'page' y 'limit' deben ser mayores a 0." });
                return;
            }

            const query = new ListImagesQuery(page, limit, seedId);
            const result = await this.listImagesQueryHandler.handle(query);

            res.json(new ListImageAPIResponse(
                result.images.map(image => new ImageAPIResponse(image.id, image.createdAt, image.createdBy, image.src, image.seedId)),
                new Pagination(result.total, result.page, result.limit)
            ))
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(500).json({ error: message });
        }
    }


    async deleteImage(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.uid;

            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const command = new DeleteImageCommand(req.params.id, userId);

            await this.deleteImageCommandHandler.handle(command);
            res.status(204).send();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(500).json({ error: message });
        }
    }
}