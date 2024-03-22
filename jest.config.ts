import type { Config } from "@jest/types";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseTestDir: string = "<rootDir>/tests";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    testMatch: [`${baseTestDir}/**/*.ts`],
};

export default config;
