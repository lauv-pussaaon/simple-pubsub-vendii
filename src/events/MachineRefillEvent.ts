import { EventType } from "./EventType";
import { IEvent } from "./IEvent";

export class MachineRefillEvent implements IEvent {
    constructor(
        private readonly _refill: number,
        private readonly _machineId: string
    ) {}

    machineId(): string {
        throw new Error("Method not implemented.");
    }

    type(): EventType {
        return EventType.REFILL;
    }
}
