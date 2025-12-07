
export class MessageAPIResponse {
    constructor(
        public readonly id: string,
        public readonly from: string,
        public readonly text: string,
        public readonly sentAt: Date
    ) {}
}