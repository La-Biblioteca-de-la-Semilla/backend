import {SuggestionAPIResponse} from "./SuggestionAPIResponse";
import {Pagination} from "../../../../shared/infrastructure/api/Pagination";

export class ListSuggestionAPIResponse {
    constructor(
        public readonly suggestions: SuggestionAPIResponse[],
        public readonly pagination: Pagination
    ) {}
}