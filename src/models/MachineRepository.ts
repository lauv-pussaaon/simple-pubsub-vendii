import { Maybe } from "../utils/Maybe";
import { IMachineRepository } from "./IMachineRepository";
import { Machine } from "./Machine";

export class MachineRepository implements IMachineRepository {
    constructor(private _machines: Machine[]) {}

    getMachines(): Maybe<Machine[]> {
        return new Maybe(this._machines);
    }
    getMachineById(id: string): Maybe<Machine> {
        const machine = this._machines.find((m) => m.id === id);
        return new Maybe(machine);
    }
    addMachine(machine: Machine): void {
        this._machines.push(machine);
    }
}
