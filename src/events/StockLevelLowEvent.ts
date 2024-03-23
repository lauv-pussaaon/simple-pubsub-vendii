import { IEvent } from "./IEvent";
import { EventType } from "./EventType";

export class StockLevelLowEvent implements IEvent {
    constructor(private readonly _machineId: string) {}

    machineId(): string {
        return this._machineId;
    }

    type(): EventType {
        return EventType.STOCK_LEVEL_LOW;
    }
}
