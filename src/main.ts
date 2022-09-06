import { IO, NeuralNetwork } from "./neural-network";
import { ActivationFunction, neuron } from "./neuron";
import { output } from "./output";
import a0 from "./training/database/a/0";
import b0 from "./training/database/b/0";
import a1 from "./training/database/a/1";
import b1 from "./training/database/b/1";
import a2 from "./training/database/a/2";
import b2 from "./training/database/b/2";

import testA from "./training/test-a";
import testB from "./training/test-b";

const training: IO = [
    [a0, output(1)],
    [a1, output(1)],
    [a2, output(1)],
    [b0, output(0)],
    [b1, output(0)],
    [b2, output(0)],
];

async function main() {
    const neuralNetwork = new NeuralNetwork([[neuron(ActivationFunction.Fr)]]);

    neuralNetwork.training(training);

    const outputs = neuralNetwork.activate(testA);

    for (const output of outputs) {
        switch (output.value) {
            case 0:
                console.log("B");
                break;
            case 1:
                console.log("A");
                break;
        }
    }
}

main();
