import { appConfig } from "../src/appConfig";
import { IMachineRepository } from "../src/models/IMachineRepository";
import { Machine } from "../src/models/Machine";
import { MachineRepository } from "../src/models/MachineRepository";

function mockMachines(): Machine[] {
    const ids = ["001", "002", "003"];
    return ids.map((id) => new Machine(id, appConfig.defaultStockLevel));
}

export function mockMachineRepository(): IMachineRepository {
    return new MachineRepository(mockMachines());
}
