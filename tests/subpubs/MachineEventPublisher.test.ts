import { EventType } from "../../src/events/EventType";
import { Machine } from "../../src/models/Machine";
import { MachineEventPublisher } from "../../src/subpubs/MachineEventPublisher";
import { MachineSaleSubscriber } from "../../src/subpubs/MachineSaleSubscriber";

describe("MachineEventPublisher Test Suite", () => {
    function mockMachines(): Machine[] {
        const ids = ["001", "002", "003"];
        return ids.map((id) => new Machine(id));
    }

    describe("Subscriber Registration", () => {
        it("should register a subscriber for a specific event type", () => {
            const machineEventPublisher = new MachineEventPublisher();

            const machines = mockMachines();
            const machineSaleSubscriber = new MachineSaleSubscriber(machines);

            expect(machineEventPublisher.subscribers).toEqual({});

            machineEventPublisher.subscribe(
                EventType.SALE,
                machineSaleSubscriber
            );

            expect(machineEventPublisher.subscribers[EventType.SALE].size).toBe(
                1
            );
        });

        it("should not register duplicated subscribers twice", () => {
            const machineEventPublisher = new MachineEventPublisher();

            const machines = mockMachines();
            const machineSaleSubscriber = new MachineSaleSubscriber(machines);

            expect(machineEventPublisher.subscribers).toEqual({});

            machineEventPublisher.subscribe(
                EventType.SALE,
                machineSaleSubscriber
            );
            machineEventPublisher.subscribe(
                EventType.SALE,
                machineSaleSubscriber
            );

            expect(machineEventPublisher.subscribers[EventType.SALE].size).toBe(
                1
            );
        });
    });
});
