import Layer from "./layer";
import Network from "./network";

async function main(args: any[]) {
    const input = new Layer(2);
    const hidden = new Layer(100);
    const output = new Layer(2);

    input.project(hidden);
    hidden.project(output);

    const network = new Network({
        input: input,
        hidden: [hidden],
        output: output,
    });

    let learningRate = 0.3;

    for (let i = 0; i < 20_000; i++) {
        network.activate([1, 1]);
        network.propagate(learningRate, [0, 0]);

        network.activate([1, 0]);
        network.propagate(learningRate, [1, 0]);

        network.activate([0, 1]);
        network.propagate(learningRate, [0, 1]);

        network.activate([0, 0]);
        network.propagate(learningRate, [1, 1]);
    }

    console.log(network.activate([1, 0]));

    // const A = new Layer(2);
    // const B = new Layer(2);
    // A.project(B);

    // let learningRate = 0.3;

    // for (let i = 0; i < 20_000; i++) {
    //     // when A activates 1
    //     A.activate([1, 1]);

    //     // train B to activate 0
    //     B.activate();
    //     B.propagate(learningRate, [1, 0]);

    //     // when A activates 1
    //     A.activate([1, 0]);

    //     // train B to activate 0
    //     B.activate();
    //     B.propagate(learningRate, [1, 0]);

    //     // when A activates 1
    //     A.activate([0, 1]);

    //     // train B to activate 0
    //     B.activate();
    //     B.propagate(learningRate, [1, 0]);

    //     // when A activates 1
    //     A.activate([0, 0]);

    //     // train B to activate 0
    //     B.activate();
    //     B.propagate(learningRate, [1, 0]);
    // }
    // // // test it
    // A.activate([0, 1]);

    // console.log(B.activate());

    // let A = new Neuron();
    // let B = new Neuron();

    // let C = new Neuron();

    // A.project(C);
    // B.project(C);

    // let learningRate = 0.3;

    // for (let i = 0; i < 20_000; i++) {
    //     // when A activates 1
    //     A.activate(1);
    //     B.activate(1);

    //     // train B to activate 0
    //     C.activate();
    //     C.propagate(learningRate, 0);

    //     // when A activates 1
    //     A.activate(1);
    //     B.activate(0);

    //     // train B to activate 0
    //     C.activate();
    //     C.propagate(learningRate, 0);

    //     // when A activates 1
    //     A.activate(0);
    //     B.activate(1);

    //     // train B to activate 0
    //     C.activate();
    //     C.propagate(learningRate, 1);

    //     // when A activates 1
    //     A.activate(0);
    //     B.activate(0);

    //     // train B to activate 0
    //     C.activate();
    //     C.propagate(learningRate, 1);
    // }

    // // test it
    // A.activate(0);
    // B.activate(1);

    // console.log(C.activate());
}

main(process.argv.slice(2));
