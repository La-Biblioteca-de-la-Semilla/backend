import { Router } from "express";
import { ImageController } from "./controllers/ImageController";
import {authenticate, authorize} from "../../../shared/infrastructure/api/middleware/authMiddleware";

export class ImagesRouter {
    private readonly router: Router;

    constructor(
        private readonly imageController: ImageController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/", (req, res) => this.imageController.listImages(req, res));
        this.router.post("/",
            authenticate,
            authorize(["USER","ADMIN"]),
            (req, res) => this.imageController.createImage(req, res)
        );
        this.router.delete("/:imageId",
            authenticate,
            authorize(["USER","ADMIN"]),
            (req, res) => this.imageController.deleteImage(req, res)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}