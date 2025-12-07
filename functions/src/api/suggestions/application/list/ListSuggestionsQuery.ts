export class ListSuggestionsQuery {
    constructor(
        public readonly userId: string,
        public readonly offset: number,
        public readonly limit: number,
        public readonly status?: "PENDING" | "ACCEPTED" | "REJECTED" // Opcional, para filtrar por estado
    ) {}
}