import { coerceArray } from "./helpers";
import { Input } from "./input";
import { Neuron } from "./neuron";
import { Output } from "./output";

export type IO = [Input[] | Input, Output[] | Output][];
export type Layer = Neuron[];

export class NeuralNetwork {
    public layers: Layer[];

    constructor(layers: Layer[] = []) {
        this.layers = layers;
    }

    public training(io: IO) {
        let isInvalid = true;

        do {
            isInvalid = false;

            for (const [input, output] of io) {
                const inputs = coerceArray(input);
                const expected = coerceArray(output);

                const received = this.propagate(inputs);

                if (received.length !== expected.length) {
                    throw new Error("O tamanho das saídas estão diferente.");
                }

                for (let index = 0; index < received.length; index++) {
                    if (received[index].value !== expected[index].value) {
                        isInvalid = true;
                        break;
                    }
                }

                if (isInvalid) {
                    for (const layer of this.layers) {
                        layer.forEach((neuron) => {
                            for (const output of expected) {
                                neuron.hotfix(inputs, output);
                            }
                        });
                    }
                }
            }
        } while (isInvalid);
    }

    public activate(inputs: Input | Input[]) {
        return this.propagate(coerceArray(inputs));
    }

    private propagate(inputs: Input[]) {
        const outputs: Output[] = [];

        for (const layer of this.layers) {
            const output = layer.map((neuron) => {
                return neuron.activate(inputs);
            });

            outputs.push(...output);
        }

        return outputs;
    }
}
