export class ListOrganizationResult {
    constructor(public readonly organizations: OrganizationResult[]) {}
}

export class OrganizationResult {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly image: string,
        public readonly url: string,
        public readonly owner: string
    ) {}
}
