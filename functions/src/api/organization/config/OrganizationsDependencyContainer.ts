import {FirestoreOrganizationRepository} from "../infrastructure/persistence/FirestoreOrganizationRepository";
import {OrganizationsRouter} from "../infrastructure/api/OrganizationsRouter";
import {OrganizationController} from "../infrastructure/api/controllers/OrganizationController";
import { ListOrganizationQueryHandler } from "../application/list-organization/ListOrganizationQueryHandler";

// Repositories
const organizationRepository = new FirestoreOrganizationRepository();

// CQRS
const listOrganizationQueryHandler = new ListOrganizationQueryHandler(organizationRepository);

// Controllers
const organizationController = new OrganizationController(listOrganizationQueryHandler);

// Router
const organizationsRouter = new OrganizationsRouter(organizationController);

export {organizationsRouter};