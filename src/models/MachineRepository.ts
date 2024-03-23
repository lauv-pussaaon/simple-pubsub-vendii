import { IMachineRepository } from "./IMachineRepository";
import { Machine } from "./Machine";

export class MachineRepository implements IMachineRepository {
    constructor(private _machines: Machine[]) {}

    getMachines(): Machine[] {
        return this._machines;
    }
    getMachineById(id: string): Machine | undefined {
        return this._machines.find((m) => m.id === id);
    }
    addMachine(machine: Machine): void {
        this._machines.push(machine);
    }
}
