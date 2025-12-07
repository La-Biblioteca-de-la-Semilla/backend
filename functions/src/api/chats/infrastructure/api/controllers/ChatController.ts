import {Request, Response} from "express";
import {CreateChatCommandHandler} from "../../../application/create-chat/CreateChatCommandHandler";
import {CreateChatCommand} from "../../../application/create-chat/CreateChatCommand";
import {ListChatsQueryHandler} from "../../../application/list-chats/ListChatsQueryHandler";
import {ListChatsQuery} from "../../../application/list-chats/ListChatsQuery";
import {ChatAPIResponse} from "./ChatAPIResponse";
import {ListChatAPIResponse} from "./ListChatAPIResponse";
import {AuthenticatedRequest} from "../../../../shared/infrastructure/api/middleware/authMiddleware";

export class ChatController {
    constructor(
        private readonly createChatCommandHandler: CreateChatCommandHandler,
        private readonly listChatsQueryHandler: ListChatsQueryHandler
    ) {
    }

    async createChat(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.uid;
            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const command = new CreateChatCommand(
                userId,
                req.body.participants,
            );

            const result = await this.createChatCommandHandler.handle(command);
            res.status(201).json(new ChatAPIResponse(
                result.id,
                result.participants,
                result.lastMessage,
                result.totalMessages,
                result.unreadBy
            ));
        } catch (error: any) {
            res.status(400).json({error: error.message});
        }
    }

    async listChats(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.uid;
            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const query = new ListChatsQuery(userId);
            const result = await this.listChatsQueryHandler.handle(query);

            const chatResponses = result.chats.map(chat => new ChatAPIResponse(
                chat.id,
                chat.participants,
                chat.lastMessage,
                chat.totalMessages,
                chat.unreadBy
            ));

            res.json(new ListChatAPIResponse(chatResponses));
        } catch (error: any) {
            res.status(500).json({error: error.message});
        }
    }
}