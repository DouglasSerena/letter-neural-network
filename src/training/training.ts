import sharp from "sharp";
import path from "path";
import glob from "glob";
import { getPixels } from "ndarray-pixels";
import { promisify } from "node:util";

const globPromise = promisify(glob);

export async function train() {
    const size = 20;

    for (const file of await find("database/a")) {
        const { data, info } = await sharp(file)
            .raw()
            .greyscale()
            .toBuffer({ resolveWithObject: true });

        console.log(getPixels(data));
    }
}

async function find(dir: string) {
    return await globPromise(path.join(__dirname, dir, "*.{png,jpg,jpeg}"));
}
