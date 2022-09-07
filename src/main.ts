import fs from "fs";
import path from "path";
import glob from "glob";
import { Bitmap } from "./shared/bitmap";
import { NeuralNetwork, Output } from "./neural-network/neural-network";
import { ActivationFunction, neuron } from "./neural-network/neuron";
import { Letter } from "./constants/letter";

const extname = "{jpeg,png,webp,avif,gif,svg,tiff}";
const neuralNetwork = new NeuralNetwork([[neuron(ActivationFunction.Fr)]]);

async function training(datas: string, output: Output[]) {
    const dir = path.join(process.cwd(), datas);
    const files = glob.sync(path.join(dir, "**", `*.${extname}`));

    for (const file of files) {
        const bitmap = await Bitmap.fromFile(file, { w: 250, h: 400 });

        bitmap.reduce({ w: 5, h: 8 });

        neuralNetwork.training([bitmap.bits, output]);
    }
}

async function main() {
    const data = `${process.cwd()}/data`;

    training(`${data}/letter/A`, [Letter.A]);
    training(`${data}/letter/B`, [Letter.B]);

    const A = fs.readFileSync(`${data}/test/A.jpg`);
    const B = fs.readFileSync(`${data}/test/B.png`);

    const bitmap = await Bitmap.fromFile(A, {
        w: 250,
        h: 400,
    });

    bitmap.reduce({ w: 5, h: 8 });

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
