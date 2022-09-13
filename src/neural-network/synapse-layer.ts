import uuid from "./shared/uuid";
import Layer from "./layer";
import Synapse from "./synapse";

export default class SynapseLayer {
    public readonly id = uuid();
    public readonly to: Layer;
    public readonly from: Layer;

    public readonly connections: Map<string, Synapse> = new Map();
    public get size(): number {
        return this.connections.size;
    }

    constructor(fromLayer: Layer, toLayer: Layer, weights?: number[]) {
        this.to = toLayer;
        this.from = fromLayer;

        for (const [key, from] of Object.entries(this.from.neurons)) {
            const index = Number(key);
            for (const to of this.to.neurons) {
                const synapse = from.project(to, weights?.[index]);

                this.connections.set(synapse.id, synapse);
            }
        }
    }
}
