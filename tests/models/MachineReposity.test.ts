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

        expect(machineRepository.getMachines().orElse([])).toEqual(machines);
    });
    it("should get machine by id correctly", () => {
        const machines = mockMachines();
        const machineRepository = new MachineRepository(machines);

        const resultMachine = machineRepository.getMachineById(
            machines.at(0)!.id
        );

        resultMachine.map((machine) => {
            expect(machine).toEqual(machines.at(0));
        });
    });
    it("can add a new machine to the repository", () => {
        const machines = mockMachines();
        const machineRepository = new MachineRepository(machines);

        const newMachine = new Machine("007", 7);
        machineRepository.addMachine(newMachine);

        const resultMachine = machineRepository.getMachineById(newMachine.id);
        resultMachine.map((machine) => {
            expect(machine).toEqual(newMachine);
            expect(machine.stockLevel).toEqual(newMachine.stockLevel);
        });
    });
});
