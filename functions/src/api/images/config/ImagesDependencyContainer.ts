import {FirestoreImageRepository} from "../infrastructure/persistence/FirestoreImageRepository";
import {CreateImageCommandHandler} from "../application/create/CreateImageCommandHandler";
import {ListImagesQueryHandler} from "../application/list/ListImagesQueryHandler";
import {DeleteImageCommandHandler} from "../application/delete/DeleteImageCommandHandler";
import {ImageController} from "../infrastructure/api/controllers/ImageController";
import {ImagesRouter} from "../infrastructure/api/ImagesRouter";
import {FirebaseCloudStorageService} from "../../shared/infrastructure/storage/FirebaseCloudStorageService";

import { EnvConfigService } from "../../shared/config/EnvConfigService";
import {eventBus} from "../../shared/config/SharedDependencyContainer";

const config = new EnvConfigService();
const publicURL = config.getRequired("APP_STORAGE_BASE_URL");

// Repositories
const imageRepository = new FirestoreImageRepository();
const imgService = new FirebaseCloudStorageService(publicURL);

// CQRS
const createImageCommandHandler = new CreateImageCommandHandler(imageRepository, imgService, eventBus);
const listImagesQueryHandler = new ListImagesQueryHandler(imageRepository);
const deleteImageCommandHandler = new DeleteImageCommandHandler(imageRepository);



// Controllers
const imageController = new ImageController(
    createImageCommandHandler,
    listImagesQueryHandler,
    deleteImageCommandHandler
);

// Router
const imagesRouter = new ImagesRouter(
    imageController
);

export { imagesRouter };