/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Create Sequence from Numbers [DBM German]",
    displayName: "Create Sequence from Numbers",
    section: "Sequences",

    subtitle(data, presets) {
        return presets.getVariableText(data.storage, data.varName);
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage, 10);
        if (type !== varType) return;
        return [data.varName, "Sequence"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop(),
        dependencies: ["sequency@0.20"]
    },

    fields: ["startNum", "endNum", "increment", "storage", "varName"],

    html(_isEvent, _data) {
        return `
        <div style="display: flex; justify-content: space-between;">
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">Start Number</span><br>
                <input id="startNum" class="round" type="text" value="1"><br>
            </div>
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">End Number</span><br>
                <input id="endNum" class="round" type="text" value="5"><br>
            </div>
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">Increment By</span><br>
                <input id="increment" class="round" type="text" value="1"><br>
            </div>
        </div>

        <store-in-variable style="padding-top: 8px;" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
        `;
    },

    init() {
    },

    action(cache) {
        const data = cache.actions[cache.index];
        const { range } = require("sequency");

        const startNum = parseInt(this.evalMessage(data.startNum, cache), 10);
        const endNum = parseInt(this.evalMessage(data.endNum, cache), 10);
        const increment = parseInt(this.evalMessage(data.increment, cache), 10);

        let sequence;

        try {
            if (isNaN(startNum)) throw new Error(`Invalid start number (${data.startNum})`);
            if (isNaN(endNum)) throw new Error(`Invalid end number (${data.endNum})`);
            if (isNaN(increment)) throw new Error(`Invalid increment number (${data.increment})`);
            if (startNum > endNum) throw new Error(`Start number (${data.startNum}) must be lower than end number (${data.endNum})`);
            if (increment < 1) throw new Error(`Increment number (${data.increment}) must be higher than 0`);

            sequence = range(startNum, endNum, increment);
        } catch (error) {
            this.displayError(data, cache, error);
        }

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(sequence, storage, varName, cache);
        this.callNextAction(cache);
    }
};
