
export class Pagination {
    constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly total: number
    ) {}
}