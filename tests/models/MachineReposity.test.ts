import { appConfig } from "../../src/appConfig";
import { Machine } from "../../src/models/Machine";
import { MachineRepository } from "../../src/models/MachineRepository";

describe("MachineReposity Test Suite", () => {
    function mockMachines(): Machine[] {
        const ids = ["001", "002", "003"];
        return ids.map((id) => new Machine(id, appConfig.defaultStockLevel));
    }

    it("should get machines list correctly", () => {
        const machines = mockMachines();
        const machineRepository = new MachineRepository(machines);

        expect(machineRepository.getMachines()).toEqual(machines);
    });
    it("should get machine by id correctly", () => {});
    it("can add a new machine to the repository", () => {});
});
