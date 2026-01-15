import { Request, Response } from "express";
import { GetExchangeUsersQueryHandler } from "../../../application/get-exchange-users/GetExchangeUsersQueryHandler";
import { GetExchangeUsersQuery } from "../../../application/get-exchange-users/GetExchangeUsersQuery";
import { AuthenticatedRequest } from "../../../../shared/infrastructure/api/middleware/authMiddleware";

export class ExchangeController {
    constructor(
        private readonly getExchangeUsersQueryHandler: GetExchangeUsersQueryHandler
    ) {}

    async getExchangeUsers(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            const userId = authReq.user?.uid;

            if (!userId) {
                res.status(401).json({ error: "Authentication required" });
                return;
            }

            const seedFilter = req.query.seedId as string | undefined;
            const query = new GetExchangeUsersQuery(userId, seedFilter);

            const matchingUsers = await this.getExchangeUsersQueryHandler.handle(query);

            res.json(matchingUsers);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(500).json({ error: message });
        }
    }
}