import { IEvent } from "../events/IEvent";
import { MachineRefillEvent } from "../events/MachineRefillEvent";
import { MachineSaleEvent } from "../events/MachineSaleEvent";

const randomMachine = (total_machine: number): string => {
    const random = Math.random() * total_machine;
    const id = Math.ceil(random).toFixed(0);
    return id.toString().padStart(3, "0");
};

export const generateMachineIds = (total_machine: number): string[] => {
    return Array.from({ length: total_machine }, (_, index) =>
        (index + 1).toString().padStart(3, "0")
    );
};

export const generateRandomEvent = (total_machine: number): IEvent => {
    const random = Math.random();
    if (random < 0.5) {
        const saleQty = Math.random() < 0.5 ? 10 : 20;
        return new MachineSaleEvent(saleQty, randomMachine(total_machine));
    }
    const refillQty = Math.random() < 0.5 ? 3 : 5;
    return new MachineRefillEvent(refillQty, randomMachine(total_machine));
};
