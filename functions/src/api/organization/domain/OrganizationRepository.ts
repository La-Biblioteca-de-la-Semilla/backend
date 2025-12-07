import {Organization} from "./Organization";

export interface OrganizationRepository {
    findAll(): Promise<Organization[]>;
    findAllByOwnerId(userId:string): Promise<Organization[]>
}