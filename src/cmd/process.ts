import glob from "glob";
import Image from "../image";
import { createWriteStream } from "fs";
import { mkdir, writeFile } from "fs/promises";

async function process(input: string, output: string) {
    const folders = glob.sync(input);

    await mkdir(`${output}/images`, { recursive: true });

    for (const folder of folders) {
        const filename = folder.split("/").pop();
        const files = glob.sync(`${folder}/*.{jpg,png,jpeg,gif,webp,svg,bmp}`);

        await mkdir(`${output}/images/${filename}`, { recursive: true });
        const write = createWriteStream(`${output}/${filename}.csv`);

        for (const [index, file] of Object.entries(files)) {
            const image = await Image.fromFile(file, { w: 250, h: 400 });

            write.write(`${image.toBitmap({ w: 5, h: 8 }).join(",")}\n`);
            await writeFile(
                `${output}/images/${filename}/${index}.png`,
                await image.toFormat("png")
            );
        }

        write.close();
    }
}

async function main(args: any[]) {
    const cwd = globalThis.process.cwd();

    await process(`${cwd}/data/raw/train/*`, `${cwd}/data/processed/train`);
    await process(`${cwd}/data/raw/test/*`, `${cwd}/data/processed/test`);
}

main(globalThis.process.argv.slice(2));
