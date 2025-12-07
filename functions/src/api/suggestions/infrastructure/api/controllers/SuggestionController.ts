import { Request, Response } from "express";
import { CreateSuggestionCommandHandler } from "../../../application/create/CreateSuggestionCommandHandler";
import { ListSuggestionsQueryHandler } from "../../../application/list/ListSuggestionsQueryHandler";
import { GetSuggestionQueryHandler } from "../../../application/get/GetSuggestionQueryHandler";
import { AcceptSuggestionCommandHandler } from "../../../application/accept-suggestion/AcceptSuggestionCommandHandler";
import { RejectSuggestionCommandHandler } from "../../../application/reject-suggestion/RejectSuggestionCommandHandler";
import { CreateSuggestionCommand } from "../../../application/create/CreateSuggestionCommand";
import { ListSuggestionsQuery } from "../../../application/list/ListSuggestionsQuery";
import { GetSuggestionQuery } from "../../../application/get/GetSuggestionQuery";
import { AcceptSuggestionCommand } from "../../../application/accept-suggestion/AcceptSuggestionCommand";
import { RejectSuggestionCommand } from "../../../application/reject-suggestion/RejectSuggestionCommand";
import {AuthenticatedRequest} from "../../../../shared/infrastructure/api/middleware/authMiddleware";
import {SuggestionAPIResponse} from "./SuggestionAPIResponse";
import {ListSuggestionAPIResponse} from "./ListSuggestionAPIResponse";
import {Pagination} from "../../../../shared/infrastructure/api/Pagination";

export class SuggestionController {
    constructor(
        private readonly createSuggestionCommandHandler: CreateSuggestionCommandHandler,
        private readonly listSuggestionsQueryHandler: ListSuggestionsQueryHandler,
        private readonly getSuggestionQueryHandler: GetSuggestionQueryHandler,
        private readonly acceptSuggestionCommandHandler: AcceptSuggestionCommandHandler,
        private readonly rejectSuggestionCommandHandler: RejectSuggestionCommandHandler
    ) {}


    async createSuggestion(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.uid || "";

            if (!req.body.seedId) {
                res.status(400).json({ error: "El campo 'seedId' es obligatorio." });
                return;
            }

            const command = new CreateSuggestionCommand(
                req.body.seedId,
                userId,
                req.body.name ?? null,
                req.body.species ?? null,
                req.body.image ?? null,
                req.body.description ?? null,
                req.body.sentOn ?? null,
                req.body.tags ?? null,
                req.body.sow ?? null,
                req.body.family ?? null,
                req.body.sfgOriginal ?? null,
                req.body.sfgMultisow ?? null,
                req.body.sfgClump ?? null,
                req.body.germinationMin ?? null,
                req.body.germinationMax ?? null
            );

            const result = await this.createSuggestionCommandHandler.handle(command);
            res.status(201).send(new SuggestionAPIResponse(
                result.id,
                result.seedId,
                result.organizationId,
                result.createdAt,
                result.createdBy,
                result.status,
                result.name,
                result.species,
                result.image,
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
            res.status(400).json({ error: error.message });
        }
    }

    async listSuggestions(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.uid;
            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const page = parseInt(req.query.page as string) || 1; // Por defecto página 1
            const limit = parseInt(req.query.limit as string) || 10; // Por defecto 10 elementos por página
            const status = req.query.status as "PENDING" | "ACCEPTED" | "REJECTED" | undefined;

            if (page < 1 || limit < 1) {
                res.status(400).json({ error: "Los parámetros 'page' y 'limit' deben ser mayores a 0." });
                return;
            }

            const offset = (page - 1) * limit;
            const query = new ListSuggestionsQuery(userId, offset, limit, status);
            const result = await this.listSuggestionsQueryHandler.handle(query);

            res.json(new ListSuggestionAPIResponse(
                result.suggestions.map(suggestionResult => new SuggestionAPIResponse(
                    suggestionResult.id,
                    suggestionResult.seedId,
                    suggestionResult.organizationId,
                    suggestionResult.createdAt,
                    suggestionResult.createdBy,
                    suggestionResult.status,
                    suggestionResult.name,
                    suggestionResult.species,
                    suggestionResult.image,
                    suggestionResult.description,
                    suggestionResult.sentOn,
                    suggestionResult.tags,
                    suggestionResult.sow,
                    suggestionResult.family,
                    suggestionResult.sfgOriginal,
                    suggestionResult.sfgMultisow,
                    suggestionResult.sfgClump,
                    suggestionResult.germinationMin,
                    suggestionResult.germinationMax
                )),
                new Pagination(result.total, page, limit)
            ));
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSuggestion(req: Request, res: Response): Promise<void> {
        try {
            const suggestionId = req.params.id;

            if (!suggestionId) {
                res.status(400).json({ error: "El parámetro 'id' es requerido." });
                return;
            }

            const query = new GetSuggestionQuery(suggestionId);
            const suggestion = await this.getSuggestionQueryHandler.handle(query);

            if (!suggestion) {
                res.status(404).json({ error: `Suggestion with ID ${suggestionId} not found.` });
                return;
            }

            res.json(new SuggestionAPIResponse(
                suggestion.id,
                suggestion.seedId,
                suggestion.organizationId,
                suggestion.createdAt,
                suggestion.createdBy,
                suggestion.status,
                suggestion.name,
                suggestion.species,
                suggestion.image,
                suggestion.description,
                suggestion.sentOn,
                suggestion.tags,
                suggestion.sow,
                suggestion.family,
                suggestion.sfgOriginal,
                suggestion.sfgMultisow,
                suggestion.sfgClump,
                suggestion.germinationMin,
                suggestion.germinationMax
            ));
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async acceptSuggestion(req: Request, res: Response): Promise<void> {
        try {
            const suggestionId = req.params.id;

            if (!suggestionId) {
                res.status(400).json({ error: "El parámetro 'id' es requerido." });
                return;
            }

            const command = new AcceptSuggestionCommand(suggestionId);
            const result = await this.acceptSuggestionCommandHandler.handle(command);

            res.status(200).send(new SuggestionAPIResponse(
                result.id,
                result.seedId,
                result.organizationId,
                result.createdAt,
                result.createdBy,
                result.status,
                result.name,
                result.species,
                result.image,
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
            res.status(400).json({ error: error.message });
        }
    }

    async rejectSuggestion(req: Request, res: Response): Promise<void> {
        try {
            const suggestionId = req.params.id;

            if (!suggestionId) {
                res.status(400).json({ error: "El parámetro 'id' es requerido." });
                return;
            }

            const command = new RejectSuggestionCommand(suggestionId);
            const result = await this.rejectSuggestionCommandHandler.handle(command);

            res.status(200).send(new SuggestionAPIResponse(
                result.id,
                result.seedId,
                result.organizationId,
                result.createdAt,
                result.createdBy,
                result.status,
                result.name,
                result.species,
                result.image,
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
            res.status(400).json({ error: error.message });
        }
    }
}