const { spawnSync } = require("node:child_process");
const { readdir, readFile } = require("node:fs/promises");
const { delimiter, join, normalize } = require("node:path");

/** @typedef {import("node:child_process").SpawnSyncOptionsWithStringEncoding} SpawnSyncOptionsWithStringEncoding */
/** @typedef {import("../types/dbm-2.1").DBM} DBM */
/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").NPMDependenciesInfo} NPMDependenciesInfo */
/** @typedef {import("../types/dbm-2.1").DBMEditorSharedWindow} DBMEditorSharedWindow */
/** @typedef {import("../types/dbm-2.1").DBMEditorModsAPI} DBMEditorModsAPI */
/** @typedef {import("../types/dbm-2.1").DBMModsAPI} DBMModsAPI */
/** @typedef {import("../types/dbm-2.1").DBMModsAPIAction} DBMModsAPIAction */
/** @typedef {import("../types/dbm-2.1").DBMSettingsJSON} DBMSettingsJSON */
/** @typedef {import("../types/dbm-2.1").DBMSharedModsAPI} DBMSharedModsAPI */

/**
 * Regex to parse package args for the NPM registry
 * @see {@link https://semver.org/}
 * @see {@link https://www.npmjs.com/package/npm-package-arg}
 */
const PACKAGE_ARG_REGEX = /^(?:(?<alias>(?:\w|-)+)@npm:)?(?:@(?<organization>(?:\w|-)+)\/)?(?<packagename>(?:\w|-)+)(?:@(?<version>(?:(?<major>0|[1-9]\d*))?(?:\.(?<minor>0|[1-9]\d*))?(?:\.(?<patch>0|[1-9]\d*))?(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)|@(?<tag>[^0-9v](?:\w|-)*))?$/;

/** @type {DBMModsAPIAction} */
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
        <br><br>

        <div style="padding-top: 8px; height: calc(100vh - 260px);">
            <span class="dbminputlabel">Debug Info</span><br>
            <textarea id="debug" rows="9" name="is-eval" style="white-space: pre; height: 100%;" disabled></textarea>
        </div>
        `;
    },

    init() {
        const { glob, document } = this;
        /** @type {DBMModsAPIAction} */
        const mods = require(join(glob.actLoc, "aaa_mods_api.mod.js"));
        const api = mods.getEditorAPI(self);

        const debugInfo = /** @type {HTMLTextAreaElement} */ (document.getElementById("debug"));
        debugInfo.value = "Initializing...";

        (async() => {
            debugInfo.value = [
                `CWD: ${await api.cwd()}`,
                `API Settings: ${JSON.stringify(await api.getAPISettings())}`
            ].join("\n");
        })();
    },

    action(cache) {
        this.callNextAction(cache);
    },

    mod(DBM) {
        // Create API
        DBM.Mods = this.getBotAPI(DBM);

        // Inject node module installer using the "readData" method
        const _readData = DBM.Files.readData;
        DBM.Files.readData = async function(callback) {
            // Try to install additional node modules
            for (const dir of DBM.Actions.modDirectories()) {
                for (const file of await readdir(dir)) {
                    if (!/\.js/i.test(file)) return;
                    /** @type {DBMAction} */
                    const action = require(join(dir, file));

                    if (Array.isArray(action.meta?.dependencies)) {
                        await DBM.Mods.install(...action.meta.dependencies);
                    }
                }
            }

            // Call the original readData method
            _readData.call(DBM.Files, callback);
        };

        // Try to install semver for version comparison
        try {
            DBM.Mods.install("semver@7.5");
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    },

    // === API ===

    getSharedAPI(helpers) {
        return {
            cwd() {
                return helpers.cwd();
            },
            getSettings() {
                return helpers.getSettings();
            },
            getAPISettings() {
                return helpers.getAPISettings();
            },
            async install(...packageSpecs) {
                const packageStates = await this.isInstalled(...packageSpecs);
                const packagesToInstall = Object.entries(packageStates).filter(e => !e[1]).map(e => e[0]);

                if (packagesToInstall.length === 0) return;

                await helpers.install(packagesToInstall);

                // Clear outdated cache
                this._dependencyInfoCache = null;
            },
            async isInstalled(...packageSpecs) {
                if (this._dependencyInfoCache === null) {
                    // Populate cache with current info
                    this._dependencyInfoCache = await helpers.getDependenciesInfo();
                }

                const dependenciesInfo = this._dependencyInfoCache;
                const packageInfoList = /** @type {RegExpMatchArray[]} */ (
                    packageSpecs.map(spec => spec.match(PACKAGE_ARG_REGEX)).filter(match => !!match)
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
            _dependencyInfoCache: null
        };
    },

    getBotAPI(DBM) {
        const sharedAPI = this.getSharedAPI({
            async cwd() {
                return process.cwd();
            },
            async getSettings() {
                return DBM.Files?.data.settings;
            },
            async getAPISettings() { // TODO Redundant
                const settings = await this.getSettings();
                const extName = "Mods API Settings [DBM German]";
                const extData = settings?.[extName];
                return extData?.customData?.[extName];
            },
            async getDependenciesInfo() {
                return this.callNPM("ls", ["--omit=dev", "--omit=optional", "--omit=peer"], { json: true, long: true });
            },
            async install(packageSpecs) {
                const readablePackagesSpecs = packageSpecs.map(name => `"${name}"`).join(", ");
                console.log("Attempting to install:", readablePackagesSpecs);

                try {
                    await this.callNPM("install", ["--save", ...packageSpecs]);
                    console.log("Successfully installed:", readablePackagesSpecs);
                } catch (e) {
                    console.error("Failed to install:", readablePackagesSpecs);
                    console.error(e);
                    throw e;
                }
            },
            async callNPM(command, args, opts) { // TODO Redundant
                const apiSettings = await this.getAPISettings();
                const nodeDir = apiSettings?.enableNodePath === "true" ? normalize(apiSettings.nodePath) : "node";
                const npmDir = apiSettings?.enableNpmPath === "true" ? normalize(apiSettings.npmPath) : "npm";

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
                    stdio: ["ignore", "pipe", "pipe"],
                    cwd: await this.cwd(),
                    env: {
                        PATH: [nodeDir, npmDir, process.env.PATH].join(delimiter)
                    }
                };

                const npmListResult = spawnSync("npm", spawnArgs, spawnOpts);

                if (npmListResult.status !== 0) {
                    throw new Error(`Failed to run NPM command: npm ${spawnArgs.join(" ")}\n${npmListResult.stderr}`);
                }

                return opts?.json ? JSON.parse(npmListResult.stdout) : npmListResult.stdout;
            }
        });

        return {
            ...sharedAPI,
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
            }
        };
    },

    getEditorAPI(window) {
        const currentElectronWindow = window.globalGetWindow();
        /** @type {(typeof currentElectronWindow)[]} */
        const electronWindowChain = [currentElectronWindow];
        for (let electronWindow = currentElectronWindow.getParentWindow(); electronWindow !== null; electronWindow = electronWindow.getParentWindow()) {
            electronWindowChain.push(electronWindow);
        }
        const mainElectronWindow = /** @type {(typeof currentElectronWindow)} */ (electronWindowChain.at(-1));

        /**
         * Execute JavaScript in the main Electron window
         * @param {string} code Code to evaluate in the page
         * @param {boolean} [userGesture] Allow HTML APIs that would normally require a gesture from the user
         * @returns {Promise<any>}
         */
        function execInMainElectronWindow(code, userGesture) {
            return mainElectronWindow.webContents.executeJavaScript(code, userGesture);
        }

        function hideElectronWindowChain() {
            electronWindowChain.forEach(window => window.hide());
        }

        function showElectronWindowChain() {
            electronWindowChain.forEach(window => window.show());
        }

        return this.getSharedAPI({
            async cwd() {
                return await execInMainElectronWindow("DBM.data['current-project']");
            },
            async getSettings() {
                return JSON.parse(await readFile(join(await this.cwd(), "data", "settings.json"), "utf-8"));
            },
            async getAPISettings() { // TODO Redundant
                const settings = await this.getSettings();
                const extName = "Mods API Settings [DBM German]";
                const extData = settings?.[extName];
                return extData?.customData?.[extName];
            },
            async getDependenciesInfo() {
                /** @type {{ dependencies: { [name: string]: string } }} */
                const packageJSON = await execInMainElectronWindow("DBM.getPackageJson()");
                /** @type {NPMDependenciesInfo} */
                const info = { dependencies: {} };

                for (const dep of Object.entries(packageJSON.dependencies)) {
                    info.dependencies[dep[0]] = {
                        name: dep[0],
                        version: dep[1]
                    };
                }

                return info;
            },
            async install(packageSpecs) {
                const readablePackagesSpecs = packageSpecs.map(name => `"${name}"`).join(", ");
                console.log("Attempting to install:", readablePackagesSpecs);
                await execInMainElectronWindow("new Promise(resolve => DBM.createLoadingWindow(() => { DBM.loadingWindow.setSkipTaskbar(true); resolve(); }));");
                hideElectronWindowChain();

                try {
                    await this.callNPM("install", ["--save", ...packageSpecs]);
                    console.log("Successfully installed:", readablePackagesSpecs);
                } catch (e) {
                    console.error("Failed to install:", readablePackagesSpecs);
                    console.error(e);
                    throw e;
                } finally {
                    await execInMainElectronWindow("DBM.loadingWindow?.destroy()");
                    showElectronWindowChain();
                }
            },
            async callNPM(command, args, opts) { // TODO Redundant
                const apiSettings = await this.getAPISettings();
                /** @type {string} */
                const dbmDir = await execInMainElectronWindow("DBM.mainLoc");
                const nodeDir = apiSettings?.enableNodePath === "true" ? normalize(apiSettings.nodePath) : join(dbmDir, "resources", "app", "nodejs");
                const npmDir = apiSettings?.enableNpmPath === "true" ? normalize(apiSettings.npmPath) : join(dbmDir, "resources", "app", "nodejs", "node_modules", "npm", "bin");

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
                    stdio: ["ignore", "pipe", "pipe"],
                    cwd: await this.cwd(),
                    env: {
                        PATH: [nodeDir, npmDir, process.env.PATH].join(delimiter)
                    }
                };

                const npmListResult = spawnSync("npm", spawnArgs, spawnOpts);

                if (npmListResult.status !== 0) {
                    throw new Error(`Failed to run NPM command: npm ${spawnArgs.join(" ")}\n${npmListResult.stderr}`);
                }

                return opts?.json ? JSON.parse(npmListResult.stdout) : npmListResult.stdout;
            }
        });
    }
};
