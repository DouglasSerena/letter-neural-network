import Neuron from "./neuron";
import SynapseLayer from "./synapse-layer";

export default class Layer {
    public readonly size: number;
    public readonly neurons: Neuron[] = [];
    public readonly connectedTo: Map<string, SynapseLayer> = new Map();

    constructor(size: number) {
        this.size = size ?? 0;

        for (let i = 0; i < size; i++) {
            this.neurons.push(new Neuron());
        }
    }

    public activate(inputs?: number[]) {
        if (inputs !== undefined && inputs.length !== this.size) {
            throw new Error(
                "O número de entradas deve ser igual ao número de neurônios na camada."
            );
        }

        const activations = this.neurons.map((neuron, index) =>
            neuron.activate(inputs?.[index])
        );

        return activations;
    }

    public propagate(rate: number, targets?: number[]) {
        if (targets !== undefined && targets.length !== this.size) {
            throw new Error(
                "O número de alvos deve ser igual ao número de neurônios na camada."
            );
        }

        if (targets === undefined) {
            targets = this.neurons.map((neuron) => neuron.activation);
        }

        this.neurons.forEach((neuron, index) =>
            neuron.propagate(rate, targets![index])
        );
    }

    public project(layer: Layer, weights?: number[]): SynapseLayer {
        const synapse = new SynapseLayer(this, layer, weights);

        this.connectedTo.set(synapse.id, synapse);

        return synapse;
    }
}
