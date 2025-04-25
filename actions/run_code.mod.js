const { accessSync, constants: fsconsts, readdirSync, readFileSync } = require("node:fs");
const { dirname, join } = require("node:path");
const { pathToFileURL } = require("node:url");

/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */
/** @typedef {import("fs").Dirent} Dirent */

/** @type {DBMAction} */
module.exports = {
    name: "Run Code [DBM German]",
    displayName: "Run Code",
    section: "Other Stuff",

    subtitle(data, _presets) {
        return /* html */ `${data.code}`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage, 10);
        if (type !== varType) return;
        return [data.varName, "Unknown Type"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["behavior", "interpretation", "code", "storage", "varName"],

    html(_isEvent, _data) {
        return /* html */ `
        <div>
            <div style="float: left; width: 45%;">
                <span class="dbminputlabel">End Behavior</span><br>
                <select id="behavior" class="round" onchange="glob.onChange1()">
                    <option value="0" selected>Call Next Action Automatically</option>
                    <option value="1">Do Not Call Next Action</option>
                </select>
            </div>
            <div style="padding-left: 5%; float: left; width: 55%;">
                <span class="dbminputlabel">Interpretation Style</span><br>
                <select id="interpretation" class="round">
                    <option value="0" selected>Evaluate Text First</option>
                    <option value="1">Evaluate Text Directly</option>
                </select>
            </div>
        </div>

        <br><br><br>

        <div style="padding-top: 8px; display: none">
            <span class="dbminputlabel">Custom Code</span><br>
            <textarea id="code" rows="9" name="is-eval" style="white-space: nowrap; resize: none;"></textarea>
        </div>

        <style>
            #monaco-editor a {
                color: unset;
            }
            #monaco-editor * {
                -webkit-animation: unset;
                animation: unset;
            }
        </style>
        <div id="monaco-editor" style="height: calc(100vh - 300px); border: 1px solid var(--input-border-color);"></div>

        <br>

        <store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable>
        `;
    },

    init() {
        const { glob } = this;
        const cwd = dirname(glob.actLoc);
        const monaco = glob.monaco = require("monaco-editor");

        const codeElement = /** @type {HTMLTextAreaElement} */ (document.getElementById("code"));
        const editorElement = /** @type {HTMLElement} */ (document.getElementById("monaco-editor"));

        /**
         * Walk directory recursively
         * @param {string} dir Directory
         * @returns {Dirent[]} Files
         */
        function walkDirSync(dir) {
            try {
                accessSync(dir, fsconsts.F_OK);
            } catch (_) {
                return [];
            }

            /** @type {Dirent[]} */
            const files = [];
            for (const entry of readdirSync(dir, { withFileTypes: true })) {
                if (entry.isDirectory()) {
                    files.push(...walkDirSync(join(dir, entry.name)));
                } else if (entry.isFile()) {
                    entry.path ||= dir;
                    files.push(entry);
                }
            }
            return files;
        }

        if (!self.MonacoEnvironment) {
            self.MonacoEnvironment = /** @type {import("monaco-editor").Window["MonacoEnvironment"]} */ ({
                getWorker(_workerId, label) {
                    switch (label) {
                        case "typescript":
                        case "javascript":
                            // @ts-ignore Accessible after bundling via esbuild
                            return /** @type {Worker} */ require("../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js").default();
                        default:
                            // @ts-ignore Accessible after bundling via esbuild
                            return /** @type {Worker} */ require("../node_modules/monaco-editor/esm/vs/editor/editor.worker.js").default();
                    }
                }
            });

            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                module: monaco.languages.typescript.ModuleKind.CommonJS,
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                allowJs: true,
                allowNonTsExtensions: true,
                rootDir: cwd,
                lib: ["ESNext"]
            });

            for (const lib of walkDirSync(join(cwd, "node_modules/@types"))) {
                if (!lib.name.endsWith(".ts")) continue;

                const libPath = join(lib.path, lib.name);
                console.log(`Loading type definitions from "${libPath}"`);
                const libSource = readFileSync(libPath, "utf-8");
                const libUri = pathToFileURL(libPath).toString();
                // Provides library source for code completion and documentation
                monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
                // Provides library source for peeking type definition and references
                monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse(libUri));
            }
        }

        glob.editor?.dispose();

        const editor = glob.editor = monaco.editor.create(editorElement, {
            value: codeElement.value,
            language: "javascript",
            theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "vs-dark" : "vs-light",
            automaticLayout: true,
            scrollBeyondLastLine: false
        });
        editor.focus();
        editor.getModel()?.onDidChangeContent(_ => codeElement.value = editor.getValue());
    },

    action(cache) {
        const data = cache.actions[cache.index];

        let code;
        if (data.interpretation === "0") {
            code = this.evalMessage(data.code, cache);
        } else {
            code = data.code;
        }

        const result = this.eval(code, cache);

        const varName = this.evalMessage(data.varName, cache);
        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        this.storeValue(result, storage, varName, cache);

        if (data.behavior === "0") {
            this.callNextAction(cache);
        }
    }
};
