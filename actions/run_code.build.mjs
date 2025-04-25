import esbuild from "esbuild";
import inlineWorkerPlugin from "esbuild-plugin-inline-worker";

export async function build() {
    /** @type {esbuild.Plugin} */
    const styleLoader = {
        name: "inline-style",
        setup({ onLoad }) {
            onLoad({ filter: /\.css$/ }, async args => {
                const result = await esbuild.build({
                    entryPoints: [args.path],
                    bundle: true,
                    loader: {
                        ".ttf": "dataurl"
                    },
                    outfile: "./dist/style.css",
                    write: false
                });
                const css = result.outputFiles[0].text;
                return { contents: `document.head.appendChild(document.createElement('style')).appendChild(document.createTextNode(${JSON.stringify(css)}))` };
            });
        }
    };

    return esbuild.build({
        entryPoints: [
            "./actions/run_code.mod.js"
        ],
        bundle: true,
        format: "cjs",
        platform: "node",
        outfile: "./dist/actions/run_code.mod.js",
        plugins: [styleLoader, inlineWorkerPlugin({
            entryPoints: [
                "./node_modules/monaco-editor/esm/vs/language/json/json.worker.js",
                "./node_modules/monaco-editor/esm/vs/language/css/css.worker.js",
                "./node_modules/monaco-editor/esm/vs/language/html/html.worker.js",
                "./node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js",
                "./node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
            ],
            bundle: true,
            format: "iife"
        })]
    });
}
