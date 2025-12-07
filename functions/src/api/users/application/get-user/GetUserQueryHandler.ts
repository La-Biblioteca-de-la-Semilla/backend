import { QueryHandler } from "../../../shared/application/QueryHandler";
import { GetUserQuery } from "./GetUserQuery";
import { GetUserResult } from "./GetUserResult";
import type { UserRepository } from "../../domain/UserRepository";

export class GetUserQueryHandler implements QueryHandler<GetUserQuery, GetUserResult | null> {
    constructor(private readonly repository: UserRepository) {}

    async handle(query: GetUserQuery): Promise<GetUserResult | null> {
        const user = await this.repository.findById(query.id);

        if (!user) {
            return null;
        }

        return GetUserResult.fromDomain(user);
    }
}