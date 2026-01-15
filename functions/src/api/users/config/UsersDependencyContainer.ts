import { FirestoreUserRepository } from "../infrastructure/persistence/FirestoreUserRepository";
import { GetUserQueryHandler } from "../application/get-user/GetUserQueryHandler";
import {UsersRouter} from "../infrastructure/api/UsersRouter";
import {UserController} from "../infrastructure/api/controllers/UserController";
import {UpdateUserCommandHandler} from "../application/update-user/UpdateUserCommandHandler";
import {EnvConfigService} from "../../shared/config/EnvConfigService";
import {FirebaseCloudStorageService} from "../../shared/infrastructure/storage/FirebaseCloudStorageService";


const config = new EnvConfigService();
const publicURL = config.getRequired("APP_STORAGE_BASE_URL");

// Repositories
const userRepository = new FirestoreUserRepository();
const imgService = new FirebaseCloudStorageService(publicURL);

// Handlers
const getUserQueryHandler = new GetUserQueryHandler(userRepository);
const updateUserCommandHandler = new UpdateUserCommandHandler(userRepository, imgService);

// Controllers
const userController = new UserController(getUserQueryHandler, updateUserCommandHandler);

// Router
const usersRouter = new UsersRouter(userController);

export { usersRouter };