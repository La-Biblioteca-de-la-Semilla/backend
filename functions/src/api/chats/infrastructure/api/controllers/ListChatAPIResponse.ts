import { ChatAPIResponse } from "./ChatAPIResponse";

export class ListChatAPIResponse {
    constructor(
        public readonly chats: ChatAPIResponse[]
    ) {}
}