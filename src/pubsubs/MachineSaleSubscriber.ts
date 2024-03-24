import { appConfig } from "../appConfig";
import { EventType } from "../events/EventType";
import { MachineSaleEvent } from "../events/MachineSaleEvent";
import { StockLevelInsufficientEvent } from "../events/StockLevelInsufficientEvent";
import { StockLevelLowEvent } from "../events/StockLevelLowEvent";
import { IMachineRepository } from "../models/IMachineRepository";
import { Machine } from "../models/Machine";
import { IMachineStockHandler } from "../services/IMachineStockHandler";
import { ISubscriber } from "./ISubscriber";
import { EventEmitter } from "events";

export class MachineSaleSubscriber implements ISubscriber {
    constructor(
        private eventEmitter: EventEmitter,
        private machineRepository: IMachineRepository,
        private machineStockHandler: IMachineStockHandler
    ) {}

    handle(event: MachineSaleEvent): void {
        this.machineRepository
            .getMachineById(event.machineId())
            .map((machine) => {
                const isStockInsufficient = this.detectInsufficientStock(
                    event.getSoldQuantity(),
                    machine
                );

                if (!isStockInsufficient) {
                    const beforeStockLevel = machine.stockLevel;
                    this.machineStockHandler.deductStock(
                        event.getSoldQuantity(),
                        machine
                    );
                    this.detectLowStockLevel(beforeStockLevel, machine);
                }
            });
    }

    detectInsufficientStock(soldQuantity: number, machine: Machine): boolean {
        if (soldQuantity > machine.stockLevel) {
            this.eventEmitter.emit(
                EventType.STOCK_LEVEL_INSUFFICIENT,
                new StockLevelInsufficientEvent(machine.id)
            );
            return true;
        }
        return false;
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
