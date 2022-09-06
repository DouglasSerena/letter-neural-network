export class Input {
    public value: number;

    constructor(value: number) {
        this.value = value;
    }
}

export function input(value: number) {
    return new Input(value);
}
