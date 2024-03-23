import { Machine } from "./Machine";

export interface IMachineRepository {
    getMachines(): Machine[];
    getMachineById(id: string): Machine | undefined;
    addMachine(machine: Machine): void;
}
