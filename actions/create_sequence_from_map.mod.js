/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Create Sequence from Map [DBM German]",
    displayName: "Create Sequence from Map",
    section: "Sequences",

    subtitle(data, presets) {
        return presets.getVariableText(data.storage2, data.varName2);
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Sequence"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename,
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "itemType", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Map" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br><br>

        <div>
            <div style="width: 35%;">
                <span class="dbminputlabel">Item Type</span><br>
                <select id="itemType" class="round">
                    <option value="0">Key-Value Pair</option>
                    <option value="1">Key</option>
                    <option value="2">Value</option>
                </select>
                <br>
            </div>
        </div>

        <store-in-variable style="padding-top: 8px;" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
        `;
    },

    init() {
        const { glob } = this;

        glob.formatItem = function(data) {
            return data.value;
        };
    },

    action(cache) {
        const data = cache.actions[cache.index];
        const { createSequence } = require("sequency");

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {Map<any, any>} */
        const map = this.getVariable(storage, varName, cache);

        const itemType = parseInt(data.itemType, 10);

        let sequence;

        try {
            switch (itemType) {
                case 0:
                    sequence = createSequence(map.entries());
                    break;
                case 1:
                    sequence = createSequence(map.keys());
                    break;
                case 2:
                    sequence = createSequence(map.values());
                    break;
            }
        } catch (error) {
            this.displayError(data, cache, error);
        }

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(sequence, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
