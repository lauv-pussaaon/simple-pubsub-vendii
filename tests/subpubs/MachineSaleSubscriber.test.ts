import { MachineSaleEvent } from "../../src/events/MachineSaleEvent";
import { Machine } from "../../src/models/Machine";
import { MachineSaleSubscriber } from "../../src/subpubs/MachineSaleSubscriber";

describe("MachineSaleSubscriber Test Suite", () => {
    const DEFAULT_STOCK_LEVEL = 20;

    function mockMachines(): Machine[] {
        const ids = ["001", "002", "003"];
        return ids.map((id) => new Machine(id, DEFAULT_STOCK_LEVEL));
    }

    it("should decrease the stock level after sell", () => {
        const machines = mockMachines();
        const machineSaleSubscriber = new MachineSaleSubscriber(machines);

        const machine1 = machines.at(0)!;
        const machine2 = machines.at(1)!;
        const beforeStockLevel = machine1.stockLevel;

        expect(machine1.stockLevel).toBe(DEFAULT_STOCK_LEVEL);
        expect(machine2.stockLevel).toBe(DEFAULT_STOCK_LEVEL);

        const saleEvent = new MachineSaleEvent(5, machine1.id);
        machineSaleSubscriber.handle(saleEvent);

        expect(machine1.stockLevel).toBe(
            beforeStockLevel - saleEvent.getSoldQuantity()
        );
        expect(machine2.stockLevel).toBe(DEFAULT_STOCK_LEVEL);
    });
});
