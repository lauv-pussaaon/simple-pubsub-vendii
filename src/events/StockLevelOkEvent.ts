import { EventType } from "./EventType";
import { IEvent } from "./IEvent";

export class StockLevelOkEvent implements IEvent {
    constructor(private readonly _machineId: string) {}

    machineId(): string {
        return this._machineId;
    }

    type(): EventType {
        return EventType.STOCK_LEVEL_OK;
    }
}
