import { Router } from "express";
import { OrganizationController } from "./controllers/OrganizationController";

export class OrganizationsRouter {
    private readonly router: Router;

    constructor(private readonly organizationController: OrganizationController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/", (req, res) => this.organizationController.listOrganizations(req, res))
    }

    getRouter(): Router {
        return this.router;
    }
}