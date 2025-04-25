/** @typedef {import("../types/dbm-2.1").DBMExtension} DBMExtension */
/** @typedef {import("../types/dbm-2.1").DBMExtensionJSON} DBMExtensionJSON */

/** @type {DBMExtension} */
module.exports = {
    name: "Mods API Settings [DBM German]",
    displayName: "Mods API Settings",
    isEditorExtension: true,
    saveButtonText: "Save API Settings",

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/extensions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["enableNodePath", "nodePath", "enableNpmPath", "npmPath"],
    defaultFields: {
        enableNodePath: "false",
        nodePath: "",
        enableNpmPath: "false",
        npmPath: ""
    },

    size() {
        return { width: 450, height: 450 };
    },

    html(data) {
        for (const field of this.fields) {
            if (data[field] === undefined) data[field] = this.defaultFields[field];
        }

        /**
         * Escape user content to be JS-friendly
         * @param {string} text Unescaped text
         * @returns {string} Escaped text
         */
        function escapeText(text) {
            return text.replaceAll("\"", "\\\"");
        }

        return /* html */ `
        <div style="padding: 8px">
            <div style="width: 35%">
                <span class="dbminputlabel">Custom Node.js Path</span><br>
                <select id="enableNodePath" class="round" onchange="glob.onEnableNodePathChanged(this)">
                    <option value="true" ${data.enableNodePath ? "selected" : ""}>Enable</option>
                    <option value="false" ${data.enableNodePath ? "" : "selected"}>Disable</option>
                </select>
            </div>
            <br>
            <div id="nodePathContainer">
                <span class="dbminputlabel">Directory containing "node.exe"</span><br>
                <input id="nodePath" class="round" type="text" value="${escapeText(data.nodePath)}" placeholder="Leave empty to use system installation..." ${data.enableNodePath === "true" ? "" : "disabled"}><br>
            </div>
            <br>
            <div style="width: 35%">
                <span class="dbminputlabel">Custom NPM Path</span><br>
                <select id="enableNpmPath" class="round" onchange="glob.onEnableNpmPathChanged(this)">
                    <option value="true" ${data.enableNpmPath ? "selected" : ""}>Enable</option>
                    <option value="false" ${data.enableNpmPath ? "" : "selected"}>Disable</option>
                </select>
            </div>
            <br>
            <div id="npmPathContainer">
                <span class="dbminputlabel">Directory containing "npm.cmd"</span><br>
                <input id="npmPath" class="round" type="text" value="${escapeText(data.npmPath)}" placeholder="Leave empty to use system installation..." ${data.enableNpmPath === "true" ? "" : "disabled"}><br>
            </div>
            <br>
        </div>
        `;
    },

    init(document, globalObject) {
        const { glob } = globalObject;
        const inputElements = ["button", "fieldset", "optgroup", "select", "textarea", "input"];

        /**
         * Enable or disable all inputs in a container
         * @param {string} containerId Container id
         * @param {boolean} enabled Enable/disable
         */
        function setInputsEnabled(containerId, enabled) {
            const container = document.getElementById(containerId);
            if (!container) return;

            let selector = "";

            for (const inputElement of inputElements) {
                if (selector.length > 0) selector += ", ";
                selector += `#${containerId} ${inputElement}`;
            }

            /** @type {NodeListOf<HTMLInputElement>} */
            const elements = container.querySelectorAll(selector);

            for (const element of elements) {
                if (enabled) {
                    element.disabled = false;
                    element.classList.remove("disabledClass");
                } else {
                    element.disabled = true;
                    element.classList.add("disabledClass");
                }
            }
        }

        glob.onEnableNodePathChanged = function(/** @type {HTMLSelectElement} */ event) {
            setInputsEnabled("nodePathContainer", event.value === "true");
        };

        glob.onEnableNpmPathChanged = function(/** @type {HTMLSelectElement} */ event) {
            setInputsEnabled("npmPathContainer", event.value === "true");
        };

        glob.onEnableNodePathChanged(document.getElementById("enableNodePath"));
        glob.onEnableNpmPathChanged(document.getElementById("enableNpmPath"));
    },

    close(document, data, _globalObject) {
        const enableNodePath = /** @type {HTMLInputElement} */ (document.getElementById("enableNodePath"));
        const enableNpmPath = /** @type {HTMLInputElement} */ (document.getElementById("enableNpmPath"));
        const nodePath = /** @type {HTMLInputElement} */ (document.getElementById("nodePath"));
        const npmPath = /** @type {HTMLInputElement} */ (document.getElementById("npmPath"));

        data.enableNodePath = enableNodePath.value;
        data.enableNpmPath = enableNpmPath.value;
        data.nodePath = nodePath.value;
        data.npmPath = npmPath.value;
    }

    /*
    mod(DBM) {
        // Nothing to do, the API action accesses the settings by itself
    }
    */
};
