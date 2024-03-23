import { EventType } from "../events/EventType";
import { MachineSaleEvent } from "../events/MachineSaleEvent";
import { StockLevelLowEvent } from "../events/StockLevelLowEvent";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";
import { EventEmitter } from "events";

export class MachineSaleSubscriber implements ISubscriber {
    constructor(
        private eventEmitter: EventEmitter,
        private machines: Machine[]
    ) {}

    handle(event: MachineSaleEvent): void {
        const stockThreshold: number = 3;
        const machine = this.machines.find((m) => m.id === event.machineId());
        if (machine) {
            const beforeStockLevel = machine.stockLevel;
            machine.stockLevel -= event.getSoldQuantity();
            if (
                beforeStockLevel >= stockThreshold &&
                machine.stockLevel < stockThreshold
            ) {
                this.eventEmitter.emit(
                    EventType.STOCK_LEVEL_LOW,
                    new StockLevelLowEvent(machine.id)
                );
            }
        }
    }
}
