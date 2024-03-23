import { EventType } from "../../src/events/EventType";
import { MachineSaleEvent } from "../../src/events/MachineSaleEvent";
import { StockLevelLowEvent } from "../../src/events/StockLevelLowEvent";
import { Machine } from "../../src/models/Machine";
import { MachineSaleSubscriber } from "../../src/subpubs/MachineSaleSubscriber";
import { EventEmitter } from "events";

describe("MachineSaleSubscriber Test Suite", () => {
    const DEFAULT_STOCK_LEVEL = 10;
    const STOCK_THRESHOLD = 3;

    function mockMachines(): Machine[] {
        const ids = ["001", "002", "003"];
        return ids.map((id) => new Machine(id, DEFAULT_STOCK_LEVEL));
    }

    it("should decrease the stock level after sell", () => {
        const machines = mockMachines();
        const eventEmitter = new EventEmitter();
        const machineSaleSubscriber = new MachineSaleSubscriber(
            eventEmitter,
            machines
        );

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

    it("should emit a StockLevelLowEvent when a machine stock drops below threshold", () => {
        const machines = mockMachines();
        const eventEmitter = new EventEmitter();

        const machineSaleSubscriber = new MachineSaleSubscriber(
            eventEmitter,
            machines
        );
        const emitSpy = jest.spyOn(eventEmitter, "emit");

        const machine1 = machines.at(0)!;
        const saleEvent = new MachineSaleEvent(
            DEFAULT_STOCK_LEVEL - STOCK_THRESHOLD + 1,
            machine1.id
        );
        machineSaleSubscriber.handle(saleEvent);
        expect(emitSpy).toHaveBeenCalledTimes(1);
        expect(emitSpy).toHaveBeenCalledWith(
            EventType.STOCK_LEVEL_LOW,
            new StockLevelLowEvent(saleEvent.machineId())
        );
    });
});
