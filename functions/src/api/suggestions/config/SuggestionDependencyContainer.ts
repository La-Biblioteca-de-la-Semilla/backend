import {FirestoreSuggestionRepository} from "../infrastructure/persistence/FirestoreSuggestionRepository";
import {SuggestionController} from "../infrastructure/api/controllers/SuggestionController";
import {SuggestionsRouter} from "../infrastructure/api/SuggestionsRouter";
import {CreateSuggestionCommandHandler} from "../application/create/CreateSuggestionCommandHandler";
import {ListSuggestionsQueryHandler} from "../application/list/ListSuggestionsQueryHandler";
import {GetSuggestionQueryHandler} from "../application/get/GetSuggestionQueryHandler";
import {AcceptSuggestionCommandHandler} from "../application/accept-suggestion/AcceptSuggestionCommandHandler";
import {RejectSuggestionCommandHandler} from "../application/reject-suggestion/RejectSuggestionCommandHandler";
import {
    FirestoreOrganizationRepository
} from "../../organization/infrastructure/persistence/FirestoreOrganizationRepository";
import {GetOrganizationsByOwnerQueryHandler} from "../../organization/application/get-organizations-by-owner/GetOrganizationsByOwnerQueryHandler";
import {FirestoreSeedRepository} from "../../seeds/infrastructure/persistence/FirestoreSeedRepository";
import {eventBus} from "../../shared/config/SharedDependencyContainer";

// Repositories
const suggestionRepository = new FirestoreSuggestionRepository();
const organizationRepository = new FirestoreOrganizationRepository();
const getOrganizationsByOwnerQueryHandler = new GetOrganizationsByOwnerQueryHandler(organizationRepository);
const seedRepository = new FirestoreSeedRepository();

// CQRS
const createSuggestionCommandHandler = new CreateSuggestionCommandHandler(suggestionRepository, seedRepository);
const listSuggestionsQueryHandler = new ListSuggestionsQueryHandler(suggestionRepository, organizationRepository);
const getSuggestionQueryHandler = new GetSuggestionQueryHandler(suggestionRepository);
const acceptSuggestionCommandHandler = new AcceptSuggestionCommandHandler(suggestionRepository, eventBus);
const rejectSuggestionCommandHandler = new RejectSuggestionCommandHandler(suggestionRepository);


// Controllers
const suggestionController = new SuggestionController(
    createSuggestionCommandHandler,
    listSuggestionsQueryHandler,
    getSuggestionQueryHandler,
    acceptSuggestionCommandHandler,
    rejectSuggestionCommandHandler,
    getOrganizationsByOwnerQueryHandler
);

// Router
const suggestionRouter = new SuggestionsRouter(suggestionController);

export { suggestionRouter };
