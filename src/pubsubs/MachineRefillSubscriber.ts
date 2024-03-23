import { appConfig } from "../appConfig";
import { EventType } from "../events/EventType";
import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";
import { EventEmitter } from "events";

export class MachineRefillSubscriber implements ISubscriber {
    constructor(
        private eventEmitter: EventEmitter,
        private machines: Machine[]
    ) {}

    handle(event: MachineRefillEvent): void {
        const machine = this.machines.find((m) => m.id === event.machineId());
        if (machine) {
            machine.stockLevel += event.getRefillQuantity();
        }
    }

    detectStockLevelOk(beforeLevel: number, machine: Machine) {
        if (
            beforeLevel < appConfig.stockThreshold &&
            machine.stockLevel >= appConfig.stockThreshold
        ) {
            this.eventEmitter.emit(
                EventType.STOCK_LEVEL_OK,
                new StockLevelOkEvent(machine.id)
            );
        }
    }
}
