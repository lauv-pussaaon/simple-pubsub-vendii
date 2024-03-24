import { Machine } from "../models/Machine";

export interface IMachineStockHandler {
    refillStock(refillQuantity: number, machine: Machine): void;
    deductStock(soldQuantity: number, machine: Machine): void;
    handleStockLevelLow(machine: Machine): void;
    handleStockInsufficient(machine: Machine): void;
    handleStockLevelOk(machine: Machine): void;
}
