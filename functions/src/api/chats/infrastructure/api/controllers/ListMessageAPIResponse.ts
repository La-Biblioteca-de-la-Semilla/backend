import { MessageAPIResponse } from "./MessageAPIResponse";
import { Pagination } from "../../../../shared/infrastructure/api/Pagination";

export class ListMessageAPIResponse {
    constructor(
        public readonly messages: MessageAPIResponse[],
        public readonly pagination: Pagination
    ) {}
}