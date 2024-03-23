import { EventType } from "../../src/events/EventType";
import { MachineRefillEvent } from "../../src/events/MachineRefillEvent";
import { MachineSaleEvent } from "../../src/events/MachineSaleEvent";
import { MachineEventPublisher } from "../../src/pubsubs/MachineEventPublisher";

describe("MachineEventPublisher Test Suite", () => {
    const mockMachineSaleSubscriber = {
        handle: jest.fn(),
    };
    const mockMachineRefillSubscriber = {
        handle: jest.fn(),
    };

    afterEach(() => jest.clearAllMocks());

    describe("subscribe Function", () => {
        it("should register a subscriber for a specific event type", () => {
            const machineEventPublisher = new MachineEventPublisher();

            expect(machineEventPublisher.subscribers).toEqual({});

            machineEventPublisher.subscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );

            expect(machineEventPublisher.subscribers[EventType.SALE].size).toBe(
                1
            );
        });

        it("should not register duplicated subscribers twice", () => {
            const machineEventPublisher = new MachineEventPublisher();

            expect(machineEventPublisher.subscribers).toEqual({});

            machineEventPublisher.subscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );
            machineEventPublisher.subscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );

            expect(machineEventPublisher.subscribers[EventType.SALE].size).toBe(
                1
            );
        });
    });

    describe("publish Function", () => {
        it("should notify all subscribers when an event is published", () => {
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

    describe("unsubscribe Function", () => {
        it("should allow a subscriber to unsubscribe from an event type", () => {
            const machineEventPublisher = new MachineEventPublisher();
            machineEventPublisher.subscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );
            machineEventPublisher.subscribe(
                EventType.REFILL,
                mockMachineRefillSubscriber
            );

            expect(machineEventPublisher.subscribers[EventType.SALE].size).toBe(
                1
            );
            expect(
                machineEventPublisher.subscribers[EventType.REFILL].size
            ).toBe(1);

            machineEventPublisher.unsubscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );

            expect(machineEventPublisher.subscribers[EventType.SALE].size).toBe(
                0
            );
            expect(
                machineEventPublisher.subscribers[EventType.REFILL].size
            ).toBe(1);
        });

        it("should not notify a subscriber after they unsubscribe", () => {
            const machineEventPublisher = new MachineEventPublisher();
            machineEventPublisher.subscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );

            const eventSale = new MachineSaleEvent(1, "001");
            machineEventPublisher.publish(eventSale);
            machineEventPublisher.publish(eventSale);
            expect(mockMachineSaleSubscriber.handle).toHaveBeenCalledTimes(2);

            machineEventPublisher.unsubscribe(
                EventType.SALE,
                mockMachineSaleSubscriber
            );
            machineEventPublisher.publish(eventSale);
            expect(mockMachineSaleSubscriber.handle).toHaveBeenCalledTimes(2);
        });
    });
});
