import {DomainEvent} from "../../../shared/domain/events/DomainEvent";

export class SuggestionAcceptedEvent implements DomainEvent {
    static readonly EVENT_NAME = "suggestion.accepted";

    readonly eventName = SuggestionAcceptedEvent.EVENT_NAME;
    readonly occurredOn: Date;

    constructor(
        readonly aggregateId: string, // suggestionId
        readonly seedId: string,
        readonly name?: string,
        readonly species?: string,
        readonly image?: string,
        readonly description?: string,
        readonly sentOn?: string,
        readonly tags?: string[],
        readonly sow?: number[],
        readonly family?: string,
        readonly sfgOriginal?: number,
        readonly sfgMultisow?: number,
        readonly sfgClump?: number,
        readonly germinationMin?: number,
        readonly germinationMax?: number
    ) {
        this.occurredOn = new Date();
    }
}