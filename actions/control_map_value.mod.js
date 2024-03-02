/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Control Map Value [DBM German]",
    displayName: "Control Map Value",
    section: "Maps and Sets",

    subtitle(data, presets) {
        let change;

        switch (data.controlType) {
            case "0":
                change = `${data.key} = ${data.value}`;
                break;
            case "1":
                change = `${data.key} += ${data.value}`;
                break;
            case "2":
                change = `delete ${data.key}`;
                break;
            default:
                change = "ERROR";
                break;
        }

        return `${presets.getVariableText(data.storage, data.varName)} [${change}]`;
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["storage", "varName", "key", "controlType", "value"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Map" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br>

        <div style="padding-top: 8px;">
            <div style="float: left; width: calc(50% - 12px);">
                <span class="dbminputlabel">Key</span><br>
                <input id="key" class="round" type="text" name="is-eval">
            </div>
            <div style="float: right; width: calc(50% - 12px);">
                <span class="dbminputlabel">Control Type</span><br>
                <select id="controlType" class="round" onchange='glob.onControlTypeChange(this)'>
                    <option value="0" selected>Set Value</option>
                    <option value="1">Add Value</option>
                    <option value="2">Delete Value</option>
                </select>
            </div>
        </div>

        <br><br><br>

        <div id="valueContainer" style="padding-top: 8px;">
            <span class="dbminputlabel">Value</span><br>
            <input id="value" class="round" type="text" name="is-eval"><br>
        </div>
        `;
    },

    init() {
        const { document, glob } = this;
        const controlTypeSelect = /** @type {HTMLSelectElement} */ (document.getElementById("controlType"));
        const valueContainer = document.getElementById("valueContainer");

        glob.onControlTypeChange = function(event) {
            valueContainer.style.display = event.value === "2" ? "none" : null;
        };

        glob.onControlTypeChange(controlTypeSelect);
    },

    action(cache) {
        const data = cache.actions[cache.index];

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {Map} */
        const map = this.getVariable(storage, varName, cache);
        const key = this.evalIfPossible(data.key, cache);
        const value = this.evalIfPossible(data.value, cache);

        switch (data.controlType) {
            case "0":
                map.set(key, value);
                break;
            case "1":
                map.set(key, map.get(key) + value);
                break;
            case "2":
                map.delete(key);
                break;
        }

        this.callNextAction(cache);
    }
};
