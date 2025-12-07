import {Request, Response} from "express";
import {GetUserQueryHandler} from "../../../application/get-user/GetUserQueryHandler";
import {GetUserQuery} from "../../../application/get-user/GetUserQuery";
import {UpdateUserCommandHandler} from "../../../application/update-user/UpdateUserCommandHandler";
import {UpdateUserCommand} from "../../../application/update-user/UpdateUserCommand";
import {AuthenticatedRequest} from "../../../../shared/infrastructure/api/middleware/authMiddleware";
import {UserAPIResponse} from "./UserAPIResponse";

export class UserController {
    constructor(
        private readonly getUserQueryHandler: GetUserQueryHandler,
        private readonly updateUserCommandHandler: UpdateUserCommandHandler
    ) {}

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const query = new GetUserQuery(req.params.id);
            const result = await this.getUserQueryHandler.handle(query);

            if (!result) {
                res.status(404).json({error: `User with ID ${req.params.id} not found`});
                return;
            }

            res.json(new UserAPIResponse(
                result.id,
                result.name,
                result.image,
                result.have,
                result.want,
                result.offer
            ));
        } catch (error: any) {
            res.status(500).json({error: error.message});
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const authReq = req as AuthenticatedRequest;
            if (!authReq.user) throw new Error("Not authenticated");

            const command = new UpdateUserCommand(
                authReq.user.uid,
                req.body.name,
                req.body.image,
                req.body.have,
                req.body.want,
                req.body.offer
            );

            const result = await this.updateUserCommandHandler.handle(command);
            res.status(204).send(new UserAPIResponse(
                result.id,
                result.name,
                result.image,
                result.have,
                result.want,
                result.offer
            ));
        } catch (error: any) {
            if (error.message.includes("not found")) {
                res.status(404).json({error: error.message});
            } else {
                res.status(400).json({error: error.message});
            }
        }
    }
}