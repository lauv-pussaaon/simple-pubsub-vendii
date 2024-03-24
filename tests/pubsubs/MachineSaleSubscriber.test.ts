import { appConfig } from "../../src/appConfig";
import { EventType } from "../../src/events/EventType";
import { MachineSaleEvent } from "../../src/events/MachineSaleEvent";
import { StockLevelInsufficientEvent } from "../../src/events/StockLevelInsufficientEvent";
import { StockLevelLowEvent } from "../../src/events/StockLevelLowEvent";
import { Machine } from "../../src/models/Machine";
import { MachineSaleSubscriber } from "../../src/pubsubs/MachineSaleSubscriber";
import { EventEmitter } from "events";
import { mockMachineRepository } from "../../test-helpers/mockHelpers";

describe("MachineSaleSubscriber Test Suite", () => {
    afterEach(() => jest.clearAllMocks());

    describe("handle Function", () => {
        it("should decrease the stock level after sell", () => {
            const machinesRepository = mockMachineRepository();
            const machines = machinesRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineSaleSubscriber = new MachineSaleSubscriber(
                eventEmitter,
                machinesRepository
            );

            const machine1 = machines.at(0)!;
            const machine2 = machines.at(1)!;
            const beforeStockLevel = machine1.stockLevel;

            expect(machine1.stockLevel).toBe(appConfig.defaultStockLevel);
            expect(machine2.stockLevel).toBe(appConfig.defaultStockLevel);

            const saleEvent = new MachineSaleEvent(5, machine1.id);
            machineSaleSubscriber.handle(saleEvent);

            expect(machine1.stockLevel).toBe(
                beforeStockLevel - saleEvent.getSoldQuantity()
            );
            expect(machine2.stockLevel).toBe(appConfig.defaultStockLevel);
        });
    });

    describe("deductStock Function", () => {
        it("should decrease the stock level correctly", () => {
            const machinesRepository = mockMachineRepository();
            const machines = machinesRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineSaleSubscriber = new MachineSaleSubscriber(
                eventEmitter,
                machinesRepository
            );

            const machine1 = machines.at(0)!;
            const beforeStockLevel = machine1.stockLevel;
            const saleEvent = new MachineSaleEvent(1, machine1.id);

            machineSaleSubscriber.deductStock(
                saleEvent.getSoldQuantity(),
                machine1
            );
            expect(machine1.stockLevel).toBe(
                beforeStockLevel - saleEvent.getSoldQuantity()
            );
        });

        it("should emit a StockLevelInsufficientEvent when trying to deduct over stock level", () => {
            const machinesRepository = mockMachineRepository();
            const machines = machinesRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineSaleSubscriber = new MachineSaleSubscriber(
                eventEmitter,
                machinesRepository
            );
            const emitSpy = jest.spyOn(eventEmitter, "emit");

            const machine1 = machines.at(0)!;
            const beforeStockLevel = machine1.stockLevel;
            const saleEvent = new MachineSaleEvent(
                machine1.stockLevel + 1,
                machine1.id
            );

            machineSaleSubscriber.deductStock(
                saleEvent.getSoldQuantity(),
                machine1
            );
            expect(machine1.stockLevel).toBe(beforeStockLevel);
            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(
                EventType.STOCK_LEVEL_INSUFFICIENT,
                new StockLevelInsufficientEvent(machine1.id)
            );
        });
    });

    describe("detechLowStockLevel Function", () => {
        it("should emit a StockLevelLowEvent when a machine stock drops below threshold", () => {
            const machinesRepository = mockMachineRepository();
            const machines = machinesRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineSaleSubscriber = new MachineSaleSubscriber(
                eventEmitter,
                machinesRepository
            );
            const emitSpy = jest.spyOn(eventEmitter, "emit");

            const machine1 = machines.at(0)!;
            const beforeLevel = appConfig.stockThreshold;
            machine1.stockLevel = appConfig.stockThreshold - 1;
            machineSaleSubscriber.detectLowStockLevel(beforeLevel, machine1);
            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith(
                EventType.STOCK_LEVEL_LOW,
                new StockLevelLowEvent(machine1.id)
            );
        });
        it("should not emit a StockLevelLowEvent if before stock level is already < threshold", () => {
            const machinesRepository = mockMachineRepository();
            const machines = machinesRepository.getMachines().orElse([])!;
            const eventEmitter = new EventEmitter();

            const machineSaleSubscriber = new MachineSaleSubscriber(
                eventEmitter,
                machinesRepository
            );
            const emitSpy = jest.spyOn(eventEmitter, "emit");

            const machine1 = machines.at(0)!;
            const beforeLevel = appConfig.stockThreshold - 1;
            machine1.stockLevel = appConfig.stockThreshold - 2;
            machineSaleSubscriber.detectLowStockLevel(beforeLevel, machine1);
            expect(emitSpy).toHaveBeenCalledTimes(0);
        });
    });
});
