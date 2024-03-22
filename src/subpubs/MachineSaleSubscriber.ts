import { MachineSaleEvent } from "../events/MachineSaleEvent";
import { Machine } from "../models/Machine";
import { ISubscriber } from "./ISubscriber";

export class MachineSaleSubscriber implements ISubscriber {
    public machines: Machine[];

    constructor(machines: Machine[]) {
        this.machines = machines;
    }

    handle(event: MachineSaleEvent): void {}
}
