import { createReadStream } from "fs";
import { createInterface } from "readline";
import Layer from "../neural-network/layer";
import Network from "../neural-network/network";

function readline(file: string, callback: (line: string) => void) {
    const readStream = createReadStream(file);
    const readline = createInterface(readStream);

    return new Promise((done) => {
        readline.on("line", callback);
        readline.on("pause", done);
    });
}

const trainFromCSV = (network: Network, filename: string, target: number[]) =>
    readline(`${process.cwd()}/data/processed/${filename}.csv`, (line) => {
        const inputs = line.split(",").map((x) => parseFloat(x));

        network.activate(inputs);
        network.propagate(0.3, target);
    });

async function main(args: any[]) {
    const input = new Layer(40);
    const hidden = new Layer(40);
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

    await readline(`${process.cwd()}/data/processed/test/a.csv`, (line) => {
        console.log(
            "A",
            network.activate(line.split(",").map((x) => parseFloat(x)))
        );
    });

    await readline(`${process.cwd()}/data/processed/test/b.csv`, (line) => {
        console.log(
            "B",
            network.activate(line.split(",").map((x) => parseFloat(x)))
        );
    });
}

main(process.argv.slice(2));
