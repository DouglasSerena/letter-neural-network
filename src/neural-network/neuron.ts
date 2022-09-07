import { Input, Output } from "./neural-network";
import { weight, Weight } from "./weight";

export enum ActivationFunction {
    Lr,
    Fr,
    Fs,
}

export class Neuron {
    public readonly weights: Weight[];

    constructor(public readonly type: ActivationFunction, weights?: Weight[]) {
        this.weights = weights ?? [];
    }

    public activate(inputs: Input[]): Output {
        return this.activationFunction(this.sum(inputs));
    }

    public hotfix(inputs: Input[], expected: Output) {
        Array.from(inputs).forEach((input, index) => {
            const weight = this.weights[index];

            weight.hotfix(input, expected, this.activate(inputs));
        });
    }

    private sum(inputs: Input[]): number {
        return Array.from(inputs).reduce((value, input, index) => {
            if (!this.weights[index]) {
                this.weights.push(weight());
            }

            return value + input * this.weights[index].value;
        }, 0);
    }

    private activationFunction(input: number): number {
        switch (this.type) {
            case ActivationFunction.Lr:
                return input > 0 ? 1 : -1;
            case ActivationFunction.Fr:
                return Math.max(Math.min(input, 1), 0);
            case ActivationFunction.Fs:
                if (input < 0) {
                    return -1 + 1 / (1 - input);
                }
                return 1 - 1 / (1 + input);
            default:
                throw new Error("Não foi encontrado essa função de ativação.");
        }
    }
}

export function neuron(type: ActivationFunction, weights?: Weight[]) {
    return new Neuron(type, weights);
}
