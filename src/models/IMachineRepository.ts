import { Machine } from "./Machine";
import { Maybe } from "../utils/Maybe";

export interface IMachineRepository {
    getMachines(): Maybe<Machine[]>;
    getMachineById(id: string): Maybe<Machine>;
    addMachine(machine: Machine): void;
}
