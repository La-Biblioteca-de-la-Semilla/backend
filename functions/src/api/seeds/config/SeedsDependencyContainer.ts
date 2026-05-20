import {FirestoreSeedRepository} from "../infrastructure/persistence/FirestoreSeedRepository";
import {CreateSeedCommandHandler} from "../application/create/CreateSeedCommandHandler";
import {GetSeedQueryHandler} from "../application/get/GetSeedQueryHandler";
import {ListSeedsQueryHandler} from "../application/list/ListSeedsQueryHandler";
import {UpdateSeedCommandHandler} from "../application/update/UpdateSeedCommandHandler";
import {DeleteSeedCommandHandler} from "../application/delete/DeleteSeedCommandHandler";
import {PublishSeedCommandHandler} from "../application/publish/PublishSeedCommandHandler";
import {SeedController} from "../infrastructure/api/controllers/SeedController";
import {SeedsRouter} from "../infrastructure/api/SeedsRouter";
import {InMemoryCacheService} from "../../shared/infrastructure/cache/InMemoryCacheService";
import {FirebaseCloudStorageService} from "../../shared/infrastructure/storage/FirebaseCloudStorageService";
import {FirestoreOrganizationRepository} from "../../organization/infrastructure/persistence/FirestoreOrganizationRepository";
import {GetOrganizationsByOwnerQueryHandler} from "../../organization/application/get-organizations-by-owner/GetOrganizationsByOwnerQueryHandler";

import { EnvConfigService } from "../../shared/config/EnvConfigService";
import {
    UpdateSeedOnSuggestionAcceptedEventHandler
} from "../application/update-on-suggestion/UpdateSeedOnSugestionAcceptedEventHandler";
import {
    UpdateSeedOnFirstImageCreatedEventHandler
} from "../application/update-on-first-image/UpdateSeedOnFirstImageCreatedEventHandler";
import {eventBus} from "../../shared/config/SharedDependencyContainer";
import {SuggestionAcceptedEvent} from "../../suggestions/domain/events/SuggestionAcceptedEvent";
import {FirstSeedImageCreatedEvent} from "../../images/domain/events/FirstSeedImageCreatedEvent";

const config = new EnvConfigService();
const publicURL = config.getRequired("APP_STORAGE_BASE_URL");


// Repositories
const seedRepository = new FirestoreSeedRepository();
const organizationRepository = new FirestoreOrganizationRepository();
const getOrganizationsByOwnerQueryHandler = new GetOrganizationsByOwnerQueryHandler(organizationRepository);
const cacheService = new InMemoryCacheService();
const imgService = new FirebaseCloudStorageService(publicURL);

// CQRS
const createSeedCommandHandler = new CreateSeedCommandHandler(seedRepository, cacheService, imgService);
const getSeedQueryHandler = new GetSeedQueryHandler(seedRepository);
const listSeedsQueryHandler = new ListSeedsQueryHandler(seedRepository, cacheService);
const updateSeedCommandHandler = new UpdateSeedCommandHandler(seedRepository, cacheService, imgService);
const deleteSeedCommandHandler = new DeleteSeedCommandHandler(seedRepository, cacheService);
const publishSeedCommandHandler = new PublishSeedCommandHandler(seedRepository, cacheService);

// Event handlers
const updateSeedOnSuggestionAcceptedEventHandler = new UpdateSeedOnSuggestionAcceptedEventHandler(updateSeedCommandHandler, cacheService);
eventBus.subscribe(
    SuggestionAcceptedEvent.EVENT_NAME,
    (event) => updateSeedOnSuggestionAcceptedEventHandler.handle(event)
)

const updateSeedOnFirstImageCreatedEventHandler = new UpdateSeedOnFirstImageCreatedEventHandler(updateSeedCommandHandler, seedRepository);
eventBus.subscribe(
    FirstSeedImageCreatedEvent.EVENT_NAME,
    (event) => updateSeedOnFirstImageCreatedEventHandler.handle(event)
)

// Controllers
const seedController = new SeedController(
    createSeedCommandHandler,
    getSeedQueryHandler,
    listSeedsQueryHandler,
    updateSeedCommandHandler,
    deleteSeedCommandHandler,
    getOrganizationsByOwnerQueryHandler,
    publishSeedCommandHandler
);

// Router
const seedsRouter = new SeedsRouter(seedController);

export { seedsRouter };
