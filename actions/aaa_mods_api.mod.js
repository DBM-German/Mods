const { spawnSync } = require("node:child_process");

/** @typedef {import("node:child_process").SpawnSyncOptionsWithStringEncoding} SpawnSyncOptionsWithStringEncoding */
/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").NPMDependenciesInfo} NPMDependenciesInfo */

/**
 * Regex to parse package args for the NPM registry
 * @see {@link https://semver.org/}
 * @see {@link https://www.npmjs.com/package/npm-package-arg}
 */
const PACKAGE_ARG_REGEX = /^(?:(?<alias>(?:\w|-)+)@npm:)?(?:@(?<organization>(?:\w|-)+)\/)?(?<packagename>(?:\w|-)+)(?:@(?<version>(?:(?<major>0|[1-9]\d*))?(?:\.(?<minor>0|[1-9]\d*))?(?:\.(?<patch>0|[1-9]\d*))?(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)|@(?<tag>[^0-9v](?:\w|-)*))?$/;

/** @type {DBMAction} */
module.exports = {
    name: "Mods API [DBM German]",
    displayName: "Mods API",
    section: "Other Stuff",

    subtitle(_data, _presets) {
        return "";
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: [],

    html(_isEvent, _data) {
        return /* html */ `
        This action provides additional internal functionality to other mods. It has no purpose in a regular action sequence and will just call the next action.
        `;
    },

    init() {
    },

    action(cache) {
        this.callNextAction(cache);
    },

    mod(DBM) {
        // Create API
        DBM.Mods = {
            install(...packageSpec) {
                const packageStates = this.isInstalled(...packageSpec);
                const packagesToInstall = Object.entries(packageStates).filter(e => !e[1]).map(e => e[0]);

                if (packagesToInstall.length === 0) return;

                const readablePackagesToInstall = packagesToInstall.map(name => `"${name}"`).join(", ");

                console.log("Attempting to install:", readablePackagesToInstall);

                this.callNPM("install", ["--save", ...packagesToInstall]);
                // Clear outdated cache
                this._dependencyInfoCache = null;

                console.log("Successfully installed:", readablePackagesToInstall);
            },
            isInstalled(...packageSpec) {
                if (this._dependencyInfoCache === null) {
                    // Populate cache with current info
                    this._dependencyInfoCache = this.callNPM("ls", ["--omit=dev", "--omit=optional", "--omit=peer"], { json: true, long: true });
                }

                const dependenciesInfo = /** @type {NPMDependenciesInfo} */ (this._dependencyInfoCache);
                const packageInfoList = /** @type {RegExpMatchArray[]} */ (
                    packageSpec.map(spec => spec.match(PACKAGE_ARG_REGEX)).filter(match => !!match)
                );
                const isSemverInstalled = Object.values(dependenciesInfo.dependencies).some(dep => dep.name === "semver");

                /** @type {Record<string, boolean>} */
                const packageStates = {};

                for (const packageInfo of packageInfoList) {
                    const { organization, packagename, version, tag } = packageInfo.groups ?? {};
                    const name = `${organization ? "@" + organization + "/" : ""}${packagename}`;

                    // Compare versions if possible, otherwise just check if the dependency is installed at all
                    const { satisfies } = isSemverInstalled ? require("semver") : { satisfies: () => true };
                    const isDepInstalled = Object.values(dependenciesInfo.dependencies).some(dep => dep.name === name && satisfies(dep.version, version));

                    packageStates[`${name}${version ? "@" + version : ""}${tag ? "@" + tag : ""}`] = isDepInstalled;
                }

                return packageStates;
            },
            callNPM(command, args, opts) {
                const spawnArgs = [
                    command,
                    ...(opts?.json ? ["--json"] : []),
                    ...(opts?.long ? ["--long"] : []),
                    ...(args ?? [])
                ];
                /** @type {SpawnSyncOptionsWithStringEncoding} */
                const spawnOpts = {
                    encoding: "utf-8",
                    windowsHide: true,
                    shell: true,
                    stdio: ["ignore", "pipe", "inherit"]
                };

                const npmListResult = spawnSync("npm", spawnArgs, spawnOpts);

                if (npmListResult.error) {
                    throw new Error(`Failed to run NPM command: npm ${spawnArgs.join(" ")}`, { cause: npmListResult.error });
                }

                return opts?.json ? JSON.parse(npmListResult.stdout) : npmListResult.stdout;
            },
            eval(content, cache, options = {}) {
                const customVariables = options?.customVariables ?? {};

                let preparation = "";

                for (const [name, { type }] of Object.entries(customVariables)) {
                    preparation += `${type === "constant" ? "const" : "let"} ${name} = this._customVariables[${name}].value;\n`;
                }

                DBM.Actions.eval.call({ ...DBM.Actions, ...{ _customVariables: customVariables } }, `${preparation}\n${content}`, cache, options?.logError);
            },
            /** @type {(input: unknown, storage: import("../types/dbm-2.1").DBMVarType, varName: string) => asserts input is unknown[]} */
            assertArrayInput(input, storage, varName) {
                if (Array.isArray(input)) return;

                throw new TypeError(`${this._varTypes[storage]} "${varName}" is not an array: ${input}`);
            },
            _varTypes: {
                1: "Temp Variable",
                2: "Server Variable",
                3: "Global Variable",
                4: "Interaction Parameter"
            },
            _dependencyInfoCache: null
        };

        const _readData = DBM.Files.readData;
        DBM.Files.readData = function(callback) {
            const fs = require("node:fs");
            const path = require("node:path");

            // Try to install additional node modules
            DBM.Actions.modDirectories().forEach(dir => {
                fs.readdirSync(dir).forEach(file => {
                    if (!/\.js/i.test(file)) return;
                    /** @type {DBMAction} */
                    const action = require(path.join(dir, file));

                    if (Array.isArray(action.meta?.dependencies)) {
                        DBM.Mods.install(...action.meta.dependencies);
                    }
                });
            });

            _readData.call(DBM.Files, callback);
        };

        // Try to install semver for version comparison
        try {
            DBM.Mods.install("semver@7.5");
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
};
