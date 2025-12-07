import {Request, Response} from "express";
import {CreateMessageCommandHandler} from "../../../application/create-message/CreateMessageCommandHandler";
import {CreateMessageCommand} from "../../../application/create-message/CreateMessageCommand";
import {AuthenticatedRequest} from "../../../../shared/infrastructure/api/middleware/authMiddleware";
import {MessageAPIResponse} from "./MessageAPIResponse";
import {Pagination} from "../../../../shared/infrastructure/api/Pagination";
import {ListMessagesQueryHandler} from "../../../application/list-messages/ListMessagesQueryHandler";
import {ListMessagesQuery} from "../../../application/list-messages/ListMessagesQuery";
import {ListMessageAPIResponse} from "./ListMessageAPIResponse";

export class MessageController {
    constructor(
        private readonly handler: CreateMessageCommandHandler,
        private readonly listMessagesQueryHandler: ListMessagesQueryHandler
    ) {
    }

    async createMessage(req: Request, res: Response): Promise<void> {
        const authReq = req as AuthenticatedRequest;
        const userId = authReq.user?.uid;
        if (!userId) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        const chatId = req.params.chatId;

        const command = new CreateMessageCommand(
            userId,
            chatId,
            req.body.text
        );
        const result = await this.handler.handle(command);
        res.status(201).json(new MessageAPIResponse(
            result.id,
            result.from,
            result.text,
            result.sentAt
        ));
    }

    async listMessages(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.uid;
            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const chatId = req.params.chatId;

            if (page < 1 || limit < 1) {
                res.status(400).json({ error: "Los parámetros 'page' y 'limit' deben ser mayores a 0." });
                return;
            }

            const query = new ListMessagesQuery(page, limit, chatId, userId);
            const result = await this.listMessagesQueryHandler.handle(query);

            res.json(new ListMessageAPIResponse(
                result.messages.map(message => new MessageAPIResponse(message.id, message.from, message.text, message.sentAt)),
                new Pagination(result.page, result.limit, result.total)
            ))
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}