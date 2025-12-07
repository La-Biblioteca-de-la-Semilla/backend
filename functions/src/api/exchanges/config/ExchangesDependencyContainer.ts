import { FirestoreExchangeUserProvider } from "../infrastructure/persistence/FirestoreExchangeUserProvider";
import { GetExchangeUsersQueryHandler } from "../application/get-exchange-users/GetExchangeUsersQueryHandler";
import { ExchangeController } from "../infrastructure/api/controllers/ExchangeController";
import { ExchangesRouter } from "../infrastructure/api/ExchangesRouter";
import {InMemoryCacheService} from "../../shared/infrastructure/cache/InMemoryCacheService";

// Providers
const exchangeUserProvider = new FirestoreExchangeUserProvider();

// Cache
const cacheService = new InMemoryCacheService();

// Handlers
const getExchangeUsersQueryHandler = new GetExchangeUsersQueryHandler(exchangeUserProvider, cacheService);

// Controllers
const exchangeController = new ExchangeController(getExchangeUsersQueryHandler);

// Router
const exchangesRouter = new ExchangesRouter(exchangeController);

export { exchangesRouter };