import { appConfig } from "../appConfig";
import { EventType } from "../events/EventType";
import { MachineSaleEvent } from "../events/MachineSaleEvent";
import { StockLevelInsufficientEvent } from "../events/StockLevelInsufficientEvent";
import { StockLevelLowEvent } from "../events/StockLevelLowEvent";
import { IMachineRepository } from "../models/IMachineRepository";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";
import { EventEmitter } from "events";

export class MachineSaleSubscriber implements ISubscriber {
    constructor(
        private eventEmitter: EventEmitter,
        private machineRepository: IMachineRepository
    ) {}

    handle(event: MachineSaleEvent): void {
        this.machineRepository
            .getMachineById(event.machineId())
            .map((machine) => {
                const beforeStockLevel = machine.stockLevel;
                this.deductStock(event.getSoldQuantity(), machine);
                this.detectLowStockLevel(beforeStockLevel, machine);
            });
    }

    deductStock(soldQuantity: number, machine: Machine) {
        if (soldQuantity > machine.stockLevel) {
            this.eventEmitter.emit(
                EventType.STOCK_LEVEL_INSUFFICIENT,
                new StockLevelInsufficientEvent(machine.id)
            );
            return;
        }
        machine.stockLevel -= soldQuantity;
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
