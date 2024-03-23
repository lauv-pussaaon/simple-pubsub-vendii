import { appConfig } from "../appConfig";
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
        const machine = this.machines.find((m) => m.id === event.machineId());
        if (machine) {
            const beforeStockLevel = machine.stockLevel;
            machine.stockLevel -= event.getSoldQuantity();
            this.detectLowStockLevel(beforeStockLevel, machine);
        }
    }

    detectLowStockLevel(beforeStockLevel: number, machine: Machine): void {
        if (
            beforeStockLevel >= appConfig.stockThreshold &&
            machine.stockLevel < appConfig.stockThreshold
        ) {
            this.eventEmitter.emit(
                EventType.STOCK_LEVEL_LOW,
                new StockLevelLowEvent(machine.id)
            );
        }
    }
}
