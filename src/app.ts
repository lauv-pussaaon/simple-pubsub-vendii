import { appConfig } from "./appConfig";
import { EventType } from "./events/EventType";
import { StockLevelInsufficientEvent } from "./events/StockLevelInsufficientEvent";
import { StockLevelLowEvent } from "./events/StockLevelLowEvent";
import { StockLevelOkEvent } from "./events/StockLevelOkEvent";
import { IMachineRepository } from "./models/IMachineRepository";
import { Machine } from "./models/Machine";
import { MachineRepository } from "./models/MachineRepository";
import { IPublishSubscribeService } from "./pubsubs/IPublishSubscribeService";
import { ISubscriber } from "./pubsubs/ISubscriber";
import { MachineEventPublisher } from "./pubsubs/MachineEventPublisher";
import { MachineRefillSubscriber } from "./pubsubs/MachineRefillSubscriber";
import { MachineSaleSubscriber } from "./pubsubs/MachineSaleSubscriber";
import { StockWarningSubscriber } from "./pubsubs/StockWarningSubscriber";
import { IMachineStockHandler } from "./services/IMachineStockHandler";
import { MachineStockHandler } from "./services/MachineStockHandler";
import { generateMachineIds, generateRandomEvent } from "./utils/helpers";
import { EventEmitter } from "events";

function setupMachineRepository(totalMachine: number): IMachineRepository {
    const machines: Machine[] = generateMachineIds(totalMachine).map(
        (id) => new Machine(id, appConfig.defaultStockLevel)
    );
    return new MachineRepository(machines);
}

function setupEventPublisher(
    eventEmiiter: EventEmitter,
    machineRepository: IMachineRepository
): IPublishSubscribeService {
    const machineStockHandler: IMachineStockHandler = new MachineStockHandler();
    const machineEventPublisher: IPublishSubscribeService =
        new MachineEventPublisher();

    const saleSubscriber: ISubscriber = new MachineSaleSubscriber(
        eventEmiiter,
        machineRepository,
        machineStockHandler
    );
    const refillSubcriber: ISubscriber = new MachineRefillSubscriber(
        eventEmiiter,
        machineRepository,
        machineStockHandler
    );
    const stockWarningSubscriber: ISubscriber = new StockWarningSubscriber(
        machineRepository,
        machineStockHandler
    );

    machineEventPublisher.subscribe(EventType.SALE, saleSubscriber);
    machineEventPublisher.subscribe(EventType.REFILL, refillSubcriber);
    machineEventPublisher.subscribe(
        EventType.STOCK_LEVEL_LOW,
        stockWarningSubscriber
    );
    machineEventPublisher.subscribe(
        EventType.STOCK_LEVEL_OK,
        stockWarningSubscriber
    );
    machineEventPublisher.subscribe(
        EventType.STOCK_LEVEL_INSUFFICIENT,
        stockWarningSubscriber
    );

    return machineEventPublisher;
}

/* handle stock alerts event from sale and refill events */
function setupChainedEventListeners(
    eventEmitter: EventEmitter,
    machineEventPublisher: IPublishSubscribeService
) {
    eventEmitter.addListener(
        EventType.STOCK_LEVEL_LOW,
        (event: StockLevelLowEvent) => {
            machineEventPublisher.publish(event);
        }
    );

    eventEmitter.addListener(
        EventType.STOCK_LEVEL_OK,
        (event: StockLevelOkEvent) => {
            machineEventPublisher.publish(event);
        }
    );

    eventEmitter.addListener(
        EventType.STOCK_LEVEL_INSUFFICIENT,
        (event: StockLevelInsufficientEvent) => {
            machineEventPublisher.publish(event);
        }
    );
}

// program
(async () => {
    let totalMachine = 10;
    const testEventsPerMachine = 10;
    const machineRepository: IMachineRepository =
        setupMachineRepository(totalMachine);

    const eventEmitter = new EventEmitter();

    const machineEventPublisher = setupEventPublisher(
        eventEmitter,
        machineRepository
    );

    setupChainedEventListeners(eventEmitter, machineEventPublisher);

    Array.from({ length: totalMachine * testEventsPerMachine }, () => {
        const event = generateRandomEvent(totalMachine);
        machineEventPublisher.publish(event);
    });

    console.log("------- Add New Machine -------");
    const newMachineCount = 3;
    generateMachineIds(totalMachine + newMachineCount)
        .slice(-newMachineCount)
        .forEach((id) =>
            machineRepository.addMachine(
                new Machine(id, appConfig.defaultStockLevel)
            )
        );
    totalMachine += newMachineCount;

    // simulate random events including added machines
    Array.from({ length: totalMachine * testEventsPerMachine }, () => {
        const event = generateRandomEvent(totalMachine);
        machineEventPublisher.publish(event);
    });

    console.log("------- Machines' Final Stock Level -------");
    machineRepository
        .getMachines()
        .map((machines) =>
            machines.forEach((machine) =>
                console.log(
                    ` current stock ${machine.id} is ${machine.stockLevel}`
                )
            )
        );
})();
