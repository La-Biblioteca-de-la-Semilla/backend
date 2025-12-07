import {User} from "../../domain/User";

export class GetUserResult {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly image: string,
        public readonly roles: string[],
        public readonly have: string[],
        public readonly want: string[],
        public readonly offer: string[]
    ) {}

    static fromDomain(user: User) {
        return new GetUserResult(
            user.id,
            user.name,
            user.image,
            user.roles,
            user.have,
            user.want,
            user.offer
        );
    }
}