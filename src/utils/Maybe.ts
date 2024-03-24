export class Maybe<T> {
    private value: T | null | undefined;

    constructor(value: T | null | undefined) {
        this.value = value;
    }

    isPresent(): boolean {
        return this.value !== null && this.value !== undefined;
    }

    map<U>(mapper: (value: T) => U): Maybe<U> {
        if (this.isPresent()) {
            return new Maybe<U>(mapper(this.value!));
        } else {
            return new Maybe<U>(null);
        }
    }

    orElse(defaultValue: T): T | null | undefined {
        return this.isPresent() ? this.value : defaultValue;
    }
}
