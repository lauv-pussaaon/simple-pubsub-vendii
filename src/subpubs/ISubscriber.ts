import { IEvent } from "../events/IEvent";

export interface ISubscriber {
    handle(event: IEvent): void;
}
