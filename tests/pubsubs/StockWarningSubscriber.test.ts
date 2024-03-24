import { StockLevelLowEvent } from "../../src/events/StockLevelLowEvent";
import { StockWarningSubscriber } from "../../src/pubsubs/StockWarningSubscriber";
import { mockMachineRepository } from "../../test-helpers/mockHelpers";

describe("StockWarningSubscriber Test Suite", () => {
    it("should handle stock level low warning", () => {
        const machineRepository = mockMachineRepository();
        const machines = machineRepository.getMachines().orElse([])!;
        const testMachine = machines.at(0)!;

        const stockWarningSub = new StockWarningSubscriber(machineRepository);
        const handleEventSpy = jest.spyOn(
            stockWarningSub,
            "handleStockLevelLow"
        );

        const event = new StockLevelLowEvent(testMachine.id);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(1);
        stockWarningSub.handle(event);
        expect(handleEventSpy).toHaveBeenCalledTimes(2);
    });
    it("should handle stock level insufficient warning", () => {});
    it("should handle stock level ok notifying", () => {});
});
