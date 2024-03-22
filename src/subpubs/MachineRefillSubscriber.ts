import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";

export class MachineRefillSubscriber implements ISubscriber {
    public machines: Machine[];

    constructor(machines: Machine[]) {
        this.machines = machines;
    }

    handle(event: MachineRefillEvent): void {
        const machine = this.machines.find((m) => m.id === event.machineId());
        if (machine) {
            machine.stockLevel += event.getRefillQuantity();
        }
    }
}
