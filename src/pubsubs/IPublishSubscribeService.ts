import { EventType } from "../events/EventType";
import { IEvent } from "../events/IEvent";
import { ISubscriber } from "./ISubscriber";

export interface IPublishSubscribeService {
    publish(event: IEvent): void;
    subscribe(eventType: EventType, handler: ISubscriber): void;
    unsubscribe(eventType: EventType, handler: ISubscriber): void;
}
