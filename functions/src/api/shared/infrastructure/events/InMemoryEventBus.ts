import {EventBus} from "../../domain/events/EventBus";
import {DomainEvent} from "../../domain/events/DomainEvent";


export class InMemoryEventBus implements EventBus {
    private handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();

    subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
        const eventHandlers = this.handlers.get(eventName);
        if (eventHandlers) {
            eventHandlers.push(handler);
        } else {
            this.handlers.set(eventName, [handler]);
        }
    }

    async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.eventName) || [];

        const promises = handlers.map(handler => handler(event));
        await Promise.all(promises);
    }
}