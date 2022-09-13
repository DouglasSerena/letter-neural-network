import sharp, { FormatEnum } from "sharp";

export type Size = { w: number; h: number };

export default class Image {
    public size: Size;
    public pixels: Uint8ClampedArray;

    private constructor(buffer: Buffer, size: Size) {
        this.size = size;
        this.pixels = new Uint8ClampedArray(buffer);
    }

    public async toFormat(format: keyof FormatEnum) {
        return await sharp(this.pixels, {
            raw: { width: this.size.w, height: this.size.h, channels: 1 },
        })
            .toFormat(format)
            .toBuffer();
    }

    public toBitmap(size: Size) {
        const pw = this.size.w / size.w;
        const ph = this.size.h / size.h;

        const pixels: number[] = new Array(size.w * size.h).fill(0);
        for (let r = 0; r < this.size.h; r++) {
            for (let c = 0; c < this.size.w; c++) {
                const pixel = r * this.size.w + c;
                const bit = this.pixels[pixel] < 200 ? 1 : 0;

                const x = Math.floor(c / pw);
                const y = Math.floor(r / ph);

                const index = y * size.w + x;
                pixels[index] += bit;
            }
        }

        const pixelsBlack = (pw * ph) / 4;
        const bits: number[] = pixels.map((bit) => {
            if (bit > pixelsBlack) {
                return 1;
            }
            return 0;
        });

        return bits;
    }

    public toCSV() {
        const rows = [];

        for (let r = 0; r < this.size.h; r++) {
            const row = [];
            for (let c = 0; c < this.size.w; c++) {
                const pixel = this.pixels[r * this.size.w + c].toString();

                row.push(pixel.padStart(3, "0"));
            }
            rows.push(row.join(","));
        }

        return rows.join("\n");
    }

    public static async fromBuffer(buffer: Buffer, size: Size): Promise<Image> {
        const isInvalid = !this.validate(size);
        if (isInvalid) {
            throw new Error(
                `Imagem com o tamanho ${size.w}x${size.h} inválido`
            );
        }

        return new Image(await this.normalize(buffer, size), size);
    }

    public static async fromBase64(base64: string, size: Size): Promise<Image> {
        const isInvalid = !this.validate(size);
        if (isInvalid) {
            throw new Error(
                `Imagem com o tamanho ${size.w}x${size.h} inválido`
            );
        }

        return new Image(await this.normalize(base64, size), size);
    }

    public static async fromFile(path: string, size: Size): Promise<Image> {
        const isInvalid = !this.validate(size);
        if (isInvalid) {
            throw new Error(
                `Imagem com o tamanho ${size.w}x${size.h} inválido`
            );
        }

        return new Image(await this.normalize(path, size), size);
    }

    private static validate(size: Size) {
        if (size.w < 1 || size.h < 1) {
            return false;
        }

        if (size.w > 250) {
            return false;
        }

        if (size.h > 400) {
            return false;
        }

        return true;
    }

    private static async normalize(
        data: string | Buffer,
        size: Size
    ): Promise<Buffer> {
        return await sharp(data)
            .raw()
            .grayscale(true)
            .resize(size.w, size.h, { kernel: "nearest", fit: "fill" })
            .toBuffer();
    }
}
