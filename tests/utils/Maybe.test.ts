import { Maybe } from "../../src/utils/Maybe";

describe("Maybe Test Suite", () => {
    it("should verify if the value is not null and undefined", () => {
        const strMaybe = new Maybe("hello");
        const numMaybe = new Maybe(1);
        const boolMaybe = new Maybe(true);
        const arrMaybe = new Maybe([]);
        const nullMaybe = new Maybe(null);
        const undefMaybe = new Maybe(undefined);

        expect(strMaybe.isPresent()).toBe(true);
        expect(numMaybe.isPresent()).toBe(true);
        expect(boolMaybe.isPresent()).toBe(true);
        expect(arrMaybe.isPresent()).toBe(true);
        expect(nullMaybe.isPresent()).toBe(false);
        expect(undefMaybe.isPresent()).toBe(false);
    });

    it("should return map value correctly", () => {
        const testVal = 1;
        const numMaybe = new Maybe(1);

        const mapper = (num: number) => num.toString();
        const result = numMaybe.map<string>(mapper);

        expect(result.isPresent()).toBe(true);
        expect(result.orElse("")).toEqual(`${testVal}`);
    });

    it("should return an Maybe of null when mapping from null", () => {
        const testVal = null;
        const strMaybe = new Maybe<string>(testVal);

        const mapper = (str: string) => Number(str);
        const result = strMaybe.map<number>(mapper);

        expect(result.isPresent()).toBe(false);
        expect(result.orElse(1)).toBe(1);
    });

    it("should return NaN if it can't map into number", () => {
        const testVal = "hello";
        const strMaybe = new Maybe<string>(testVal);

        const mapper = (str: string) => Number(str);
        const result = strMaybe.map<number>(mapper);

        expect(result.isPresent()).toBe(true);
        expect(result.orElse(1)).toBe(NaN);
    });
});
