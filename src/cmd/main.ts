import { createReadStream } from "fs";
import { createInterface } from "readline";
import Layer from "../neural-network/layer";
import Network from "../neural-network/network";

const trainFromCSV = (network: Network, filename: string, target: number[]) =>
    new Promise((done) => {
        const readStream = createReadStream(
            `${process.cwd()}/data/processed/${filename}.csv`
        );
        const readline = createInterface(readStream);

        readline.on("line", (line) => {
            const inputs = line.split(",").map((x) => parseFloat(x));

            network.activate(inputs);
            network.propagate(0.3, target);
        });

        readline.on("pause", done);
    });

async function main(args: any[]) {
    const input = new Layer(5 * 8);
    const hidden = new Layer(5 * 8 * 2);
    const output = new Layer(1);

    input.project(hidden);
    hidden.project(output);

    const network = new Network({
        input: input,
        hidden: [hidden],
        output: output,
    });

    for (let i = 0; i < 2_000; i++) {
        await trainFromCSV(network, "train/a", [0]);
        await trainFromCSV(network, "train/b", [1]);
    }

    const A = [
        0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0,
    ];
    const B = [
        0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1,
        0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    ];

    console.log("A", network.activate(A));
    console.log("B", network.activate(B));
}

main(process.argv.slice(2));
