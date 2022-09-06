import { Input } from "./input";
import { Output } from "./output";

export class Weight {
    public value: number;

    constructor(value?: number) {
        this.value = value ?? Math.round(Math.random() * 2 - 1);
    }

    public hotfix(input: Input, expected: Output, received: Output) {
        this.value =
            this.value + 1 * (expected.value - received.value) * input.value;
    }
}

export function weight(value?: number) {
    return new Weight(value);
}
