import * as express from "express";
import * as cors from "cors";
import {rateLimit} from "express-rate-limit";
import {seedsRouter} from "./seeds/config/SeedsDependencyContainer";
import {usersRouter} from "./users/config/UsersDependencyContainer";
import {organizationsRouter} from "./organization/config/OrganizationsDependencyContainer";
import {imagesRouter} from "./images/config/ImagesDependencyContainer";
import {suggestionRouter} from "./suggestions/config/SuggestionDependencyContainer";
import {exchangesRouter} from "./exchanges/config/ExchangesDependencyContainer";
import {chatsRouter} from "./chats/config/ChatsDependencyContainer";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: true,
});
app.use(apiLimiter);


// Routing
app.use("/users", usersRouter.getRouter());
app.use("/seeds", seedsRouter.getRouter());
app.use("/organizations", organizationsRouter.getRouter());
app.use("/images", imagesRouter.getRouter());
app.use("/suggestions", suggestionRouter.getRouter());
app.use("/exchanges", exchangesRouter.getRouter());
app.use("/chats", chatsRouter.getRouter());


export {app};
