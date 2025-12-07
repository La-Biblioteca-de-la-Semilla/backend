import { Router } from "express";
import { ExchangeController } from "./controllers/ExchangeController";
import { authenticate } from "../../../shared/infrastructure/api/middleware/authMiddleware";

export class ExchangesRouter {
    private readonly router: Router;

    constructor(
        private readonly exchangeController: ExchangeController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/",
            authenticate,
            (req, res) => this.exchangeController.getExchangeUsers(req, res)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}