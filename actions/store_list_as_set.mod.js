/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Store List as Set [DBM German]",
    displayName: "Store List as Set",
    section: "Lists and Loops",

    subtitle(data, presets) {
        return `Store ${presets.getVariableText(data.storage, data.varName)} as Set`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Set"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
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

        <br><br><br>

        <store-in-variable style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
        `;
    },

    init() {
        const { glob, document } = this;

        glob.listChange(document.getElementById("storage"), "varNameContainer");
    },

    async action(cache) {
        const data = cache.actions[cache.index];

        const list = await this.getListFromData(data.storage, data.varName, cache);

        let set;

        try {
            set = new Set(list);
        } catch (error) {
            this.displayError(data, cache, error);
        }

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(set, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
