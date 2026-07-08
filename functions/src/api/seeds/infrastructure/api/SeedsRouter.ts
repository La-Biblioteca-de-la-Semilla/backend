import { Router } from "express";
import { SeedController } from "./controllers/SeedController";
import { authenticate, authenticateOptional } from "../../../shared/infrastructure/api/middleware/authMiddleware";

export class SeedsRouter {
    private readonly router: Router;

    constructor(
        private readonly seedController: SeedController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/", authenticateOptional, (req, res) => this.seedController.listSeeds(req, res));
        this.router.get("/:id", (req, res) => this.seedController.getSeed(req, res));

        this.router.post("/",
            authenticate,
            (req, res) => this.seedController.createSeed(req, res)
        );
        this.router.put("/:id",
            authenticate,
            (req, res) => this.seedController.updateSeed(req, res)
        );
        this.router.post("/:id/publish",
            authenticate,
            (req, res) => this.seedController.publishSeed(req, res)
        );
        this.router.delete("/:id",
            authenticate,
            (req, res) => this.seedController.deleteSeed(req, res)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
