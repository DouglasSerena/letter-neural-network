import fs from "fs";
import path from "path";
import glob from "glob";
import { Bitmap } from "./shared/bitmap";
import { NeuralNetwork, Output } from "./neural-network/neural-network";
import { ActivationFunction, neuron } from "./neural-network/neuron";
import { Letter } from "./constants/letter";

const extname = "{jpeg,png,webp,avif,gif,svg,tiff}";
const neuralNetwork = new NeuralNetwork([[neuron(ActivationFunction.Fr)]]);

async function training(input: string, output: Output[]) {
    const files = glob.sync(path.join(input, "**", `*.${extname}`));

    for (const file of files) {
        const bitmap = await Bitmap.fromFile(file, { w: 250, h: 400 });

        bitmap.reduce({ w: 10, h: 16 });

        neuralNetwork.training([bitmap.bits, output]);
    }
}

async function main() {
    const data = `${process.cwd()}/data`;

    training(`${data}/B`, [Letter.B]);
    training(`${data}/A`, [Letter.A]);

    const A = fs.readFileSync(`${process.cwd()}/test/A.jpg`);
    const B = fs.readFileSync(`${process.cwd()}/test/B.jpg`);

    const bitmap = await Bitmap.fromFile(B, {
        w: 250,
        h: 400,
    });

    bitmap.reduce({ w: 10, h: 16 });

    const letter = neuralNetwork.predict(bitmap.bits);

    switch (letter[0]) {
        case 0:
            console.log(Letter.A);
            break;
        case 1:
            console.log(Letter.B);
            break;
    }
}

main();
