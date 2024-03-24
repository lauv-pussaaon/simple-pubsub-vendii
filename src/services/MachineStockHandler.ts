import { Machine } from "../models/Machine";
import { IMachineStockHandler } from "./IMachineStockHandler";

export class MachineStockHandler implements IMachineStockHandler {
    refillStock(refillQuantity: number, machine: Machine): void {
        machine.stockLevel += refillQuantity;
        console.log(
            `Refilled stock of machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }
    deductStock(soldQuantity: number, machine: Machine): void {
        machine.stockLevel -= soldQuantity;
        console.log(
            `Deducted stock of machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }
    handleStockLevelLow(machine: Machine): void {
        console.log(
            `Stock level low warning from machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }
    handleStockInsufficient(machine: Machine): void {
        console.log(
            `Stock level insufficient from machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }
    handleStockLevelOk(machine: Machine): void {
        console.log(
            `Stock level ok from machine #${machine.id} - current level is ${machine.stockLevel}`
        );
    }
}
