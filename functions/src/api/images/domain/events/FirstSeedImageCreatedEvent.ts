import {DomainEvent} from "../../../shared/domain/events/DomainEvent";

export class FirstSeedImageCreatedEvent implements DomainEvent {
    static readonly EVENT_NAME = "FIRST_SEED_IMAGE_CREATED";

    readonly eventName = FirstSeedImageCreatedEvent.EVENT_NAME;
    readonly occurredOn: Date;

    constructor(
        readonly aggregateId: string, // imageId
        readonly seedId: string,
        readonly imageUrl: string
    ) {
        this.occurredOn = new Date();
    }
}
