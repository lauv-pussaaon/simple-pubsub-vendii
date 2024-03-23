export type AppConfig = {
    defaultStockLevel: number;
    stockThreshold: number;
};

export const appConfig: AppConfig = {
    defaultStockLevel: 10,
    stockThreshold: 3,
};
