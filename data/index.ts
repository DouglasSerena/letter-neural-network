import fs from "fs";
import path from "path";
import glob from "glob";
import sharp from "sharp";
import { Bitmap } from "../src/shared/bitmap";

const extname = "{jpg,jpeg,png,webp,avif,gif,svg,tiff}";

export async function processImage(input: string, output: string) {
    const files = glob.sync(path.join(input, `*.${extname}`));

    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const buffer = await sharp(file)
            .grayscale()
            .resize(250, 400, {
                background: "white",
                kernel: "nearest",
                fit: "fill",
            })
            .toFormat("png")
            .toBuffer();

        fs.writeFileSync(path.join(output, `${index}.png`), buffer);

        const bitmap = (await Bitmap.fromFile(file, { w: 250, h: 400 })).reduce(
            { w: 10, h: 16 }
        );

        fs.writeFileSync(
            path.join(output, `${index}.json`),
            `[\n${bitmap.toMatrix().join(",\n")}\n]`
        );
    }
}

async function main() {
    const raw = path.join(__dirname, "raw");

    const A = path.join(__dirname, "A");
    const B = path.join(__dirname, "B");

    fs.rmSync(A, { recursive: true, force: true });
    fs.rmSync(B, { recursive: true, force: true });

    fs.mkdirSync(A);
    fs.mkdirSync(B);

    const rawA = path.join(raw, "A");
    const rawB = path.join(raw, "B");

    await processImage(rawA, A);
    await processImage(rawB, B);
}

main();
