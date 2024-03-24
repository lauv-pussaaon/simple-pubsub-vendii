import { EventType } from "../events/EventType";
import { IEvent } from "../events/IEvent";
import { IMachineRepository } from "../models/IMachineRepository";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";

export class StockWarningSubscriber implements ISubscriber {
    constructor(private machineRepository: IMachineRepository) {}

    handle(event: IEvent): void {
        this.machineRepository
            .getMachineById(event.machineId())
            .map((machine) => {
                switch (event.type()) {
                    case EventType.STOCK_LEVEL_LOW:
                        this.handleStockLevelLow(machine);
                        break;
                    case EventType.STOCK_LEVEL_INSUFFICIENT:
                        this.handleStockInsufficient(machine);
                        break;
                    case EventType.STOCK_LEVEL_OK:
                        this.handleStockLevelOk(machine);
                        break;
                }
            });
    }

    handleStockLevelLow(machine: Machine) {
        console.log(
            `Stock level low warning from machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }

    handleStockInsufficient(machine: Machine) {
        console.log(
            `Stock level insufficient from machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }

    handleStockLevelOk(machine: Machine) {
        console.log(
            `Stock level ok from machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }
}
