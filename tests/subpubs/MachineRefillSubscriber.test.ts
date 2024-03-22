import { MachineRefillEvent } from "../../src/events/MachineRefillEvent";
import { Machine } from "../../src/models/Machine";
import { MachineRefillSubscriber } from "../../src/subpubs/MachineRefillSubscriber";

describe("MachineRefillSubscriber Test Suite", () => {
    const DEFAULT_STOCK_LEVEL = 20;

    function mockMachines(): Machine[] {
        const ids = ["001", "002", "003"];
        return ids.map((id) => new Machine(id, DEFAULT_STOCK_LEVEL));
    }

    it("should increase the stock level after refill", () => {
        const machines = mockMachines();
        const machineSaleSubscriber = new MachineRefillSubscriber(machines);

        const machine1 = machines.at(0)!;
        const machine2 = machines.at(1)!;
        const beforeStockLevel = machine1.stockLevel;

        expect(machine1.stockLevel).toBe(DEFAULT_STOCK_LEVEL);
        expect(machine2.stockLevel).toBe(DEFAULT_STOCK_LEVEL);

        const refillEvent = new MachineRefillEvent(5, machine1.id);
        machineSaleSubscriber.handle(refillEvent);

        expect(machine1.stockLevel).toBe(
            beforeStockLevel + refillEvent.getRefillQuantity()
        );
        expect(machine2.stockLevel).toBe(DEFAULT_STOCK_LEVEL);
    });
});
