import { appConfig } from "../appConfig";
import { EventType } from "../events/EventType";
import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { StockLevelOkEvent } from "../events/StockLevelOkEvent";
import { IMachineRepository } from "../models/IMachineRepository";
import { Machine } from "../models/Machine";
import { IMachineStockHandler } from "../services/IMachineStockHandler";
import { ISubscriber } from "./ISubscriber";
import { EventEmitter } from "events";

export class MachineRefillSubscriber implements ISubscriber {
    constructor(
        private eventEmitter: EventEmitter,
        private machinesRepository: IMachineRepository,
        private machineStockHandler: IMachineStockHandler
    ) {}

    handle(event: MachineRefillEvent): void {
        this.machinesRepository
            .getMachineById(event.machineId())
            .map((machine) => {
                const beforeStockLevel = machine.stockLevel;

                this.machineStockHandler.refillStock(
                    event.getRefillQuantity(),
                    machine
                );

                this.detectStockLevelOk(beforeStockLevel, machine);
            });
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
