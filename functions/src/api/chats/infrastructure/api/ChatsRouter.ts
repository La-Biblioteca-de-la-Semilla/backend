import { Router } from "express";
import { ChatController } from "./controllers/ChatController";
import { authenticate } from "../../../shared/infrastructure/api/middleware/authMiddleware";
import {MessageController} from "./controllers/MessageController";

export class ChatsRouter {
    private readonly router: Router;

    constructor(
        private readonly chatController: ChatController,
        private readonly messageController: MessageController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/", 
            authenticate, 
            (req, res) => this.chatController.createChat(req, res)
        );

        this.router.get("/", 
            authenticate, 
            (req, res) => this.chatController.listChats(req, res)
        );

        this.router.post("/:chatId/messages",
            authenticate,
            (req, res) => this.messageController.createMessage(req, res)
        );

        this.router.get("/:chatId/messages",
            authenticate,
            (req, res) => this.messageController.listMessages(req, res))

    }

    getRouter(): Router {
        return this.router;
    }
}