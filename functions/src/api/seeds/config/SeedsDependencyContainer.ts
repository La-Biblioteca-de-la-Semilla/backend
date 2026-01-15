import {FirestoreSeedRepository} from "../infrastructure/persistence/FirestoreSeedRepository";
import {CreateSeedCommandHandler} from "../application/create/CreateSeedCommandHandler";
import {GetSeedQueryHandler} from "../application/get/GetSeedQueryHandler";
import {ListSeedsQueryHandler} from "../application/list/ListSeedsQueryHandler";
import {UpdateSeedCommandHandler} from "../application/update/UpdateSeedCommandHandler";
import {DeleteSeedCommandHandler} from "../application/delete/DeleteSeedCommandHandler";
import {SeedController} from "../infrastructure/api/controllers/SeedController";
import {SeedsRouter} from "../infrastructure/api/SeedsRouter";
import {InMemoryCacheService} from "../../shared/infrastructure/cache/InMemoryCacheService";
import {FirebaseCloudStorageService} from "../../shared/infrastructure/storage/FirebaseCloudStorageService";

import { EnvConfigService } from "../../shared/config/EnvConfigService";
import {
    UpdateSeedOnSuggestionAcceptedEventHandler
} from "../application/update-on-suggestion/UpdateSeedOnSugestionAcceptedEventHandler";
import {eventBus} from "../../shared/config/SharedDependencyContainer";
import {SuggestionAcceptedEvent} from "../../suggestions/domain/events/SuggestionAcceptedEvent";

const config = new EnvConfigService();
const publicURL = config.getRequired("APP_STORAGE_BASE_URL");


// Repositories
const seedRepository = new FirestoreSeedRepository();
const cacheService = new InMemoryCacheService();
const imgService = new FirebaseCloudStorageService(publicURL);

// CQRS
const createSeedCommandHandler = new CreateSeedCommandHandler(seedRepository, cacheService, imgService);
const getSeedQueryHandler = new GetSeedQueryHandler(seedRepository);
const listSeedsQueryHandler = new ListSeedsQueryHandler(seedRepository, cacheService);
const updateSeedCommandHandler = new UpdateSeedCommandHandler(seedRepository, cacheService, imgService);
const deleteSeedCommandHandler = new DeleteSeedCommandHandler(seedRepository, cacheService);

// Event handlers
const updateSeedOnSuggestionAcceptedEventHandler = new UpdateSeedOnSuggestionAcceptedEventHandler(updateSeedCommandHandler, cacheService);
eventBus.subscribe(
    SuggestionAcceptedEvent.EVENT_NAME,
    (event) => updateSeedOnSuggestionAcceptedEventHandler.handle(event)
)

// Controllers
const seedController = new SeedController(
    createSeedCommandHandler,
    getSeedQueryHandler,
    listSeedsQueryHandler,
    updateSeedCommandHandler,
    deleteSeedCommandHandler
);

// Router
const seedsRouter = new SeedsRouter(seedController);

export { seedsRouter };
