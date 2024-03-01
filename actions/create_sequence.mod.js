/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Create Sequence [DBM German]",
    displayName: "Create Sequence",
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

    fields: ["values", "storage", "varName"],

    html(_isEvent, _data) {
        return `
        <dialog-list id="values" fields='["value"]' dialogResizable dialogTitle="Sequence Value" dialogWidth="600" dialogHeight="150" listLabel="Sequence Values" listStyle="height: calc(100vh - 290px);" itemName="Value" itemHeight="28px;" itemTextFunction="glob.formatItem(data)" itemStyle="line-height: 28px;">
            <div style="padding: 16px;">
                <div>
                    <span class="dbminputlabel">Value</span><br>
                    <input id="value" class="round" type="text" name="is-eval"><br>
                </div>
            </div>
        </dialog-list>

        <br>

        <store-in-variable selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
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
        const { emptySequence } = require("sequency");

        let sequence = emptySequence();

        for (let i = 0; i < data.values.length; i++) {
            const val = this.evalIfPossible(data.values[i].value, cache);
            sequence = sequence.plus(val);
        }

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(sequence, storage, varName, cache);
        this.callNextAction(cache);
    }
};
