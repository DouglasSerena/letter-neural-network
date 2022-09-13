import Layer from "./layer";
import SynapseLayer from "./synapse-layer";

export type Layers = {
    input: Layer;
    hidden: Layer[];
    output: Layer;
};

export default class Network {
    public readonly layers: Layers;

    constructor(layers: Layers) {
        this.layers = {
            input: layers.input ?? null,
            hidden: layers.hidden ?? [],
            output: layers.output ?? null,
        };
    }

    public activate(input: number[]): number[] {
        this.layers.input.activate(input);

        for (var i = 0; i < this.layers.hidden.length; i++) {
            this.layers.hidden[i].activate();
        }

        return this.layers.output.activate();
    }

    public propagate(rate: number, targets: number[]): void {
        this.layers.output.propagate(rate, targets);

        for (var i = this.layers.hidden.length - 1; i >= 0; i--) {
            this.layers.hidden[i].propagate(rate);
        }
    }

    public project(network: Network, weights: number[]): SynapseLayer {
        return this.layers.output.project(network.layers.input, weights);
    }

    public toJson(): Record<string, any> {
        return {};
    }
    public static fromJson(json: Record<string, any>) {}
}
