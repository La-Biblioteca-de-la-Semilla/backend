import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authenticate, authorize } from "../../../shared/infrastructure/api/middleware/authMiddleware";

export class UsersRouter {
    private readonly router: Router;

    constructor(private readonly userController: UserController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/:id",
            authenticate,
            authorize(["USER", "ADMIN"]),
            (req, res) => this.userController.getUser(req, res)
        );

        this.router.put("/:id",
            authenticate,
            authorize(["USER", "ADMIN"]),
            (req, res) => this.userController.updateUser(req, res)
        );
    }


    getRouter(): Router {
        return this.router;
    }
}