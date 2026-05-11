export class GetOrganizationsByOwnerResult {
    constructor(public readonly organizations: OrganizationByOwnerResult[]) {}
}

export class OrganizationByOwnerResult {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly image: string,
        public readonly url: string,
        public readonly owner: string
    ) {}
}
