export class UpdateUserCommand {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly image?: string,
        public readonly have?: string[],
        public readonly want?: string[],
        public readonly offer?: string[]
    ) {}
}
