import { IEvent } from "../events/IEvent";
import { ISubscriber } from "./ISubscriber";

export class MachineRefillSubscriber implements ISubscriber {
    handle(event: IEvent): void {
        throw new Error("Method not implemented.");
    }
}
