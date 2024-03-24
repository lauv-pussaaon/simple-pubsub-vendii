import { EventType } from "../events/EventType";
import { IEvent } from "../events/IEvent";
import { IMachineRepository } from "../models/IMachineRepository";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";

export class StockWarningSubscriber implements ISubscriber {
    constructor(private machinesRepository: IMachineRepository) {}

    handle(event: IEvent): void {
        this.machinesRepository
            .getMachineById(event.machineId())
            .map((machine) => {
                switch (event.type()) {
                    case EventType.STOCK_LEVEL_LOW:
                        this.handleStockLevelLow(machine);
                        break;
                    case EventType.STOCK_LEVEL_INSUFFICIENT:
                        break;
                    case EventType.STOCK_LEVEL_OK:
                        break;
                }
            });
    }

    handleStockLevelLow(machine: Machine) {
        console.log(
            `Stock level low warning from machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }
}
