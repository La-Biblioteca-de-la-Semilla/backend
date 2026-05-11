import {Router} from "express";
import {SuggestionController} from "./controllers/SuggestionController";
import {authenticate} from "../../../shared/infrastructure/api/middleware/authMiddleware";

export class SuggestionsRouter {
    private readonly router: Router;

    constructor(
        private readonly suggestionController: SuggestionController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/",
            authenticate,
            (req, res) => this.suggestionController.createSuggestion(req, res));

        this.router.get("/",
            authenticate,
            (req, res) => this.suggestionController.listSuggestions(req, res)
        );
        this.router.get("/:id",
            authenticate,
            (req, res) => this.suggestionController.getSuggestion(req, res)
        );
        this.router.post("/:id/accept",
            authenticate,
            (req, res) => this.suggestionController.acceptSuggestion(req, res)
        );
        this.router.post("/:id/reject",
            authenticate,
            (req, res) => this.suggestionController.rejectSuggestion(req, res)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}