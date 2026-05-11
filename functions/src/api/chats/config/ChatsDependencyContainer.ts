import {FirestoreChatRepository} from "../infrastructure/persistence/FirestoreChatRepository";
import {CreateChatCommandHandler} from "../application/create-chat/CreateChatCommandHandler";
import {ListChatsQueryHandler} from "../application/list-chats/ListChatsQueryHandler";
import {ChatController} from "../infrastructure/api/controllers/ChatController";
import {ChatsRouter} from "../infrastructure/api/ChatsRouter";
import {MessageController} from "../infrastructure/api/controllers/MessageController";
import {CreateMessageCommandHandler} from "../application/create-message/CreateMessageCommandHandler";
import {FirestoreMessageRepository} from "../infrastructure/persistence/FirestoreMessageRepository";
import {ListMessagesQueryHandler} from "../application/list-messages/ListMessagesQueryHandler";
import {GetChatQueryHandler} from "../application/get-chat/GetChatQueryHandler";

// Repositories
const chatRepository = new FirestoreChatRepository();
const messageRepository = new FirestoreMessageRepository();

// CQRS
const createChatCommandHandler = new CreateChatCommandHandler(chatRepository);
const listChatsQueryHandler = new ListChatsQueryHandler(chatRepository);

const createMessageCommandHandler = new CreateMessageCommandHandler(messageRepository, chatRepository);
const listMessagesQueryHandler = new ListMessagesQueryHandler(messageRepository);
const getChatQueryHandler = new GetChatQueryHandler(chatRepository);

// Controllers
const chatController = new ChatController(createChatCommandHandler, listChatsQueryHandler);
const messageController = new MessageController(createMessageCommandHandler, listMessagesQueryHandler, getChatQueryHandler);

// Router
const chatsRouter = new ChatsRouter(chatController, messageController);

export { chatsRouter };