import { EventType } from "./EventType";

export interface IEvent {
    type(): EventType;
    machineId(): string;
}
