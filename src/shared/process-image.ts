import fs from "fs";
import path from "path";
import glob from "glob";
import sharp from "sharp";

const extname = "{jpg,jpeg,png,webp,avif,gif,svg,tiff}";

export async function processImage(input: string, output: string) {
    const dir = path.join(process.cwd(), input);
    const files = glob.sync(path.join(dir, `*.${extname}`));

    for (let index = 0; index < files.length; index++) {
        console.log(index);
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

        fs.writeFileSync(
            path.join(process.cwd(), output, `${index}.png`),
            buffer
        );
    }
}
