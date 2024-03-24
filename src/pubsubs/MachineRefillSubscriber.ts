import { appConfig } from "../appConfig";
import { EventType } from "../events/EventType";
import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { IMachineRepository } from "../models/IMachineRepository";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";
import { EventEmitter } from "events";

export class MachineRefillSubscriber implements ISubscriber {
    constructor(
        private eventEmitter: EventEmitter,
        private machinesRepository: IMachineRepository
    ) {}

    handle(event: MachineRefillEvent): void {
        this.machinesRepository
            .getMachineById(event.machineId())
            .map((machine) =>
                this.refillStock(event.getRefillQuantity(), machine)
            );
    }

    refillStock(refillQuantity: number, machine: Machine) {
        machine.stockLevel += refillQuantity;
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
