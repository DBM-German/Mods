/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Create Sequence from List [DBM German]",
    displayName: "Create Sequence from List",
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

    fields: ["storage", "varName", "storage2", "varName2"],

    html(isEvent, data) {
        return `
        <div>
            <div style="float: left; width: 35%;">
                <span class="dbminputlabel">Source List</span><br>
                <select id="storage" class="round" onchange="glob.listChange(this, 'varNameContainer')">
                    ${data.lists[isEvent ? 1 : 0]}
                </select>
            </div>
            <div id="varNameContainer" style="display: none; float: right; width: 60%;">
                <span class="dbminputlabel">Variable Name</span><br>
                <input id="varName" class="round" type="text" list="variableList">
            </div>
        </div>

        <br><br><br><br>

        <store-in-variable style="padding-top: 8px;" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
        `;
    },

    init() {
        const { glob, document } = this;

        glob.listChange(document.getElementById("storage"), "varNameContainer");
    },

    async action(cache) {
        const data = cache.actions[cache.index];
        const { asSequence } = require("sequency");

        /** @type {any[]} */
        const list = await this.getListFromData(data.storage, data.varName, cache);

        let sequence;

        try {
            sequence = asSequence(list);
        } catch (error) {
            this.displayError(data, cache, error);
        }

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(sequence, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
