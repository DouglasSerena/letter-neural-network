export class Output {
    public value: number;

    constructor(value: number) {
        this.value = value;
    }
}

export function output(value: number) {
    return new Output(value);
}
