import {ImageAPIResponse} from "./ImageAPIResponse";
import {Pagination} from "../../../../shared/infrastructure/api/Pagination";

export class ListImageAPIResponse {
    constructor(
        public readonly images: ImageAPIResponse[],
        public readonly pagination: Pagination
    ) {}
}