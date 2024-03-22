import { EventType } from "../../src/events/EventType";
import { MachineRefillEvent } from "../../src/events/MachineRefillEvent";
import { MachineSaleEvent } from "../../src/events/MachineSaleEvent";
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

    describe("Event Publishing", () => {
        it("should notify all subscribers when an event is published", () => {
            const mockMachineSaleSubscriber = {
                handle: jest.fn(),
            };
            const mockMachineRefillSubscriber = {
                handle: jest.fn(),
            };

            const machineEventPublisher = new MachineEventPublisher();
            machineEventPublisher.subscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );
            machineEventPublisher.subscribe(
                EventType.REFILL,
                mockMachineRefillSubscriber
            );

            const eventSale = new MachineSaleEvent(1, "001");
            machineEventPublisher.publish(eventSale);
            const eventRefill = new MachineRefillEvent(1, "001");
            machineEventPublisher.publish(eventRefill);
            machineEventPublisher.publish(eventRefill);

            expect(mockMachineSaleSubscriber.handle).toHaveBeenCalledTimes(1);
            expect(mockMachineRefillSubscriber.handle).toHaveBeenCalledTimes(2);
        });

        it("should not notify subscribers of other event types", () => {
            const mockMachineSaleSubscriber = {
                handle: jest.fn(),
            };
            const mockMachineRefillSubscriber = {
                handle: jest.fn(),
            };

            const machineEventPublisher = new MachineEventPublisher();
            machineEventPublisher.subscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );

            const eventSale = new MachineSaleEvent(1, "001");
            machineEventPublisher.publish(eventSale);

            expect(mockMachineSaleSubscriber.handle).toHaveBeenCalledTimes(1);
            expect(mockMachineRefillSubscriber.handle).toHaveBeenCalledTimes(0);
        });
    });
});
