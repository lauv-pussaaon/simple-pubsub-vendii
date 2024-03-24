import { EventType } from "../events/EventType";
import { IEvent } from "../events/IEvent";
import { IMachineRepository } from "../models/IMachineRepository";
import { Machine } from "../models/Machine";
import { IMachineStockHandler } from "../services/IMachineStockHandler";
import { ISubscriber } from "./ISubscriber";

export class StockWarningSubscriber implements ISubscriber {
    constructor(
        private machineRepository: IMachineRepository,
        private machineStockHandler: IMachineStockHandler
    ) {}

    handle(event: IEvent): void {
        this.machineRepository
            .getMachineById(event.machineId())
            .map((machine) => {
                switch (event.type()) {
                    case EventType.STOCK_LEVEL_LOW:
                        this.machineStockHandler.handleStockLevelLow(machine);
                        break;
                    case EventType.STOCK_LEVEL_INSUFFICIENT:
                        this.machineStockHandler.handleStockInsufficient(
                            machine
                        );
                        break;
                    case EventType.STOCK_LEVEL_OK:
                        this.machineStockHandler.handleStockLevelOk(machine);
                        break;
                }
            });
    }
}
