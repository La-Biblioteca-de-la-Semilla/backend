import {OrganizationAPIResponse} from "./OrganizationAPIResponse";

export class ListOrganizationAPIResponse {
    constructor(
        public readonly organizations: OrganizationAPIResponse[]
    ) {}
}