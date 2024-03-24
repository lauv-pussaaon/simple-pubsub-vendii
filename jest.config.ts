import type { Config } from "@jest/types";

/** @type {import('ts-jest').JestConfigWithTsJest} */
const baseDir: string = "<rootDir>/src";
const baseTestDir: string = "<rootDir>/tests";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [`${baseDir}/**/*.ts`],
    coveragePathIgnorePatterns: [
        `${baseDir}/app.ts`,
        `${baseDir}/utils/helpers.ts`,
    ],
    testMatch: [`${baseTestDir}/**/*.ts`],
};

export default config;
