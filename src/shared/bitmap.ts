import sharp from "sharp";

export type Dimension = { w: number; h: number };

export class Bitmap {
    public size: Dimension;
    public bits: number[];

    private constructor(bits: Int8Array, size: Dimension) {
        this.size = size;
        this.bits = Array.from(bits);
    }

    public reduce(size: Dimension) {
        const bits = Array.from<number>({ length: size.w * size.h });

        let pixels: Dimension = {
            w: this.size.w / size.w,
            h: this.size.h / size.h,
        };
        for (let row = 0; row < size.h; row++) {
            for (let col = 0; col < size.w; col++) {
                let count = 0;

                for (let y = 0; y < pixels.h; y++) {
                    for (let x = 0; x < pixels.w; x++) {
                        const pixelX = col * pixels.w + x; // pega o valor x do pixel; sendo x o valor do pixel atual + o valor da coluna atual * o valor do tamanho do pixel
                        const pixelY = row * pixels.h + y; // pega o valor y do pixel; sendo y o valor do pixel atual + o valor da linha atual * o valor do tamanho do pixel
                        const offset = pixelY * this.size.w + pixelX; // pega o deslocamento do pixel atual

                        if (this.bits[offset]) {
                            count++;
                        }
                    }
                }

                const index = row * size.w + col;
                bits[index] = Number(count > 600);
            }
        }

        this.size = size;
        this.bits = bits;
    }

    public toMatrix() {
        const matrix = [];

        for (let i = 0; i < this.size.h; i++) {
            const row = [];

            for (let j = 0; j < this.size.w; j++) {
                row.push(this.bits[i * this.size.w + j]);
            }

            matrix.push(row);
        }

        return matrix;
    }

    public static async fromFile(file: string | Buffer, dimensions: Dimension) {
        const buffer = await sharp(file)
            .raw()
            .grayscale()
            .resize(dimensions.w, dimensions.h, {
                kernel: "nearest",
                fit: "fill",
            })
            .toBuffer();

        const uint8ClampedArray = new Uint8ClampedArray(buffer);

        const bits = new Int8Array(
            uint8ClampedArray.map((value) => Number(value < 240))
        );

        return new Bitmap(bits, dimensions);
    }
}
