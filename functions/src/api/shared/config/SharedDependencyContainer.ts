import {InMemoryEventBus} from "../infrastructure/events/InMemoryEventBus";

const eventBus = new InMemoryEventBus();

export { eventBus };