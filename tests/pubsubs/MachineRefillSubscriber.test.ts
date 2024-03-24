import { appConfig } from "../../src/appConfig";
import { EventType } from "../../src/events/EventType";
import { MachineRefillEvent } from "../../src/events/MachineRefillEvent";
import { StockLevelOkEvent } from "../../src/events/StockLevelOkEvent";
import { Machine } from "../../src/models/Machine";
import { MachineRefillSubscriber } from "../../src/pubsubs/MachineRefillSubscriber";
import { EventEmitter } from "events";
import { mockMachineRepository } from "../../test-helpers/mockHelpers";

describe("MachineRefillSubscriber Test Suite", () => {
    afterEach(() => jest.clearAllMocks());

    describe("handle Function", () => {
        it("should increase the stock level after refill", () => {
            const machineRepository = mockMachineRepository();
            const machines = machineRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineSaleSubscriber = new MachineRefillSubscriber(
                eventEmitter,
                machineRepository
            );

            const machine1 = machines.at(0)!;
            const machine2 = machines.at(1)!;
            const beforeStockLevel = machine1.stockLevel;

            expect(machine1.stockLevel).toBe(appConfig.defaultStockLevel);
            expect(machine2.stockLevel).toBe(appConfig.defaultStockLevel);

            const refillEvent = new MachineRefillEvent(5, machine1.id);
            machineSaleSubscriber.handle(refillEvent);

            expect(machine1.stockLevel).toBe(
                beforeStockLevel + refillEvent.getRefillQuantity()
            );
            expect(machine2.stockLevel).toBe(appConfig.defaultStockLevel);
        });
    });

    describe("refillStock Function", () => {
        it("should increase the stock level correctly", () => {
            const machineRepository = mockMachineRepository();
            const machines = machineRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();
            const machineRefillSubscriber = new MachineRefillSubscriber(
                eventEmitter,
                machineRepository
            );

            const machine1 = machines.at(0)!;
            const beforeStockLevel = machine1.stockLevel;
            const saleEvent = new MachineRefillEvent(1, machine1.id);

            machineRefillSubscriber.refillStock(
                saleEvent.getRefillQuantity(),
                machine1
            );
            expect(machine1.stockLevel).toBe(
                beforeStockLevel + saleEvent.getRefillQuantity()
            );
        });
    });

    describe("detechStockLevelOk Function", () => {
        it("should emit a StockLevelOkEvent when a machine stock refilled >= threshold", () => {
            const machineRepository = mockMachineRepository();
            const machines = machineRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineRefillSubscriber = new MachineRefillSubscriber(
                eventEmitter,
                machineRepository
            );
            const emitSpy = jest.spyOn(eventEmitter, "emit");

            const machine1 = machines.at(0)!;
            const beforeLevel = appConfig.stockThreshold - 1;
            machine1.stockLevel = appConfig.stockThreshold;
            machineRefillSubscriber.detectStockLevelOk(beforeLevel, machine1);
            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(
                EventType.STOCK_LEVEL_OK,
                new StockLevelOkEvent(machine1.id)
            );
        });
        it("should not emit a StockLevelOkEvent if before stock level is >= threshold", () => {
            const machineRepository = mockMachineRepository();
            const machines = machineRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineRefillSubscriber = new MachineRefillSubscriber(
                eventEmitter,
                machineRepository
            );
            const emitSpy = jest.spyOn(eventEmitter, "emit");

            const machine1 = machines.at(0)!;
            const beforeLevel = appConfig.stockThreshold;
            machine1.stockLevel = appConfig.stockThreshold + 1;
            machineRefillSubscriber.detectStockLevelOk(beforeLevel, machine1);
            expect(emitSpy).toHaveBeenCalledTimes(0);
        });
    });
});
