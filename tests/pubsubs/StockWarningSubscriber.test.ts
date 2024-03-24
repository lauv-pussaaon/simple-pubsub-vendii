import { StockLevelInsufficientEvent } from "../../src/events/StockLevelInsufficientEvent";
import { StockLevelLowEvent } from "../../src/events/StockLevelLowEvent";
import { StockLevelOkEvent } from "../../src/events/StockLevelOkEvent";
import { StockWarningSubscriber } from "../../src/pubsubs/StockWarningSubscriber";
import { MachineStockHandler } from "../../src/services/MachineStockHandler";
import { mockMachineRepository } from "../../test-helpers/mockHelpers";

describe("StockWarningSubscriber Test Suite", () => {
    afterEach(() => jest.clearAllMocks());

    it("should handle stock level low warning", () => {
        const machineRepository = mockMachineRepository();
        const machines = machineRepository.getMachines().orElse([])!;
        const testMachine = machines.at(0)!;
        const machineStockHandler = new MachineStockHandler();

        const stockWarningSub = new StockWarningSubscriber(
            machineRepository,
            machineStockHandler
        );
        const handleEventSpy = jest.spyOn(
            machineStockHandler,
            "handleStockLevelLow"
        );

        const event = new StockLevelLowEvent(testMachine.id);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(1);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(2);
    });

    it("should handle stock level insufficient warning", () => {
        const machineRepository = mockMachineRepository();
        const machines = machineRepository.getMachines().orElse([])!;
        const testMachine = machines.at(0)!;
        const machineStockHandler = new MachineStockHandler();

        const stockWarningSub = new StockWarningSubscriber(
            machineRepository,
            machineStockHandler
        );
        const handleEventSpy = jest.spyOn(
            machineStockHandler,
            "handleStockInsufficient"
        );

        const event = new StockLevelInsufficientEvent(testMachine.id);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(1);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(2);
    });

    it("should handle stock level ok notifying", () => {
        const machineRepository = mockMachineRepository();
        const machines = machineRepository.getMachines().orElse([])!;
        const testMachine = machines.at(0)!;
        const machineStockHandler = new MachineStockHandler();

        const stockWarningSub = new StockWarningSubscriber(
            machineRepository,
            machineStockHandler
        );
        const handleEventSpy = jest.spyOn(
            machineStockHandler,
            "handleStockLevelOk"
        );

        const event = new StockLevelOkEvent(testMachine.id);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(1);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(2);
    });
});
