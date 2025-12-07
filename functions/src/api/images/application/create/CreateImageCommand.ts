export class CreateImageCommand {
    constructor(
        public readonly src: string,
        public readonly seedId: string,
        public readonly createdAt: Date,
        public readonly createdBy: string
    ) {}
}