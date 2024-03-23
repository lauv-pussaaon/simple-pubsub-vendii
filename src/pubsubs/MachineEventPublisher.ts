import { EventType } from "../events/EventType";
import { IEvent } from "../events/IEvent";
import { IPublishSubscribeService } from "./IPublishSubscribeService";
import { ISubscriber } from "./ISubscriber";

export class MachineEventPublisher implements IPublishSubscribeService {
    public subscribers: { [eventType: string]: Set<ISubscriber> } = {};

    subscribe(eventType: EventType, handler: ISubscriber): void {
        if (!this.subscribers[eventType]) {
            this.subscribers[eventType] = new Set<ISubscriber>();
        }
        this.subscribers[eventType].add(handler);
    }

    publish(event: IEvent): void {
        const subscribers = this.subscribers[event.type()];
        if (subscribers) {
            subscribers.forEach((sub) => sub.handle(event));
        }
    }

    unsubscribe(eventType: EventType, handler: ISubscriber): void {
        this.subscribers[eventType].delete(handler);
    }
}
