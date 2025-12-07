import {User} from "../../domain/User";

export class UpdateUserCommandResult {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly image: string,
        public readonly have: string[],
        public readonly want: string[],
        public readonly offer: string[]
    ) {}

    static fromDomain(user: User) {
        return new UpdateUserCommandResult(
            user.id,
            user.name,
            user.image,
            user.have,
            user.want,
            user.offer
        );
    }
}
