export class GetExchangeUsersQuery {
    constructor(
        public readonly userId: string,
        public readonly seedFilter?: string
    ) {}
}