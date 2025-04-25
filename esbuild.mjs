import { accessSync, constants as fsconsts, mkdirSync, readdirSync, rmSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** @typedef {import("fs").Dirent} Dirent */
/** @typedef {import("esbuild").BuildResult} BuildResult */

const modFolders = ["actions", "events", "extensions"];

/** @type {Promise<void>[]} */
const copyTasks = [];

/** @type {Promise<BuildResult>[]} */
const buildTasks = [];

for (const modFolder of modFolders) {
    const modFiles = readdirSync(modFolder).filter(isMod);

    rmSync(join("dist", modFolder), { recursive: true, force: true });
    mkdirSync(join("dist", modFolder), { recursive: true });

    for (const modFile of modFiles) {
        const buildFile = join(modFolder, modFile.replace(/\.mod\.js$/, ".build.mjs"));

        try {
            accessSync(buildFile, fsconsts.R_OK);
            // Execute build file
            buildTasks.push(import(pathToFileURL(buildFile).toString()).then(file => file.build()));
        } catch (_) {
            // No build file, copy raw file
            copyTasks.push(copyFile(join(modFolder, modFile), join("dist", modFolder, modFile)));
        }
    }
}

(async() => {
    await Promise.all(copyTasks);
    const buildResults = await Promise.all(buildTasks);

    for (const result of buildResults) {
        if (result.errors.length > 0) {
            console.error(result.errors);
        }
        if (result.warnings.length > 0) {
            console.error(result.warnings);
        }
    }
})();

/**
 * Check if a file is a mod file
 * @param {string} file File name
 * @returns {boolean} Whether the file is a mod file
 */
function isMod(file) {
    return file.endsWith(".mod.js");
}
