/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Store Map Value [DBM German]",
    displayName: "Store Map Value",
    section: "Maps and Sets",

    subtitle(data, presets) {
        return `Store Value from ${presets.getVariableText(data.storage, data.varName)}`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Unknown Type"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["storage", "varName", "key", "defaultVal", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Map" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br>

        <div style="padding-top: 8px;">
            <div style="float: left; width: calc(35% - 12px);">
                <span class="dbminputlabel">Key</span><br>
                <input id="key" class="round" type="text" name="is-eval">
            </div>
            <div style="float: right; width: calc(65% - 12px);">
                <span class="dbminputlabel">Default Value (if entry doesn't exist)</span><br>
                <input id="defaultVal" class="round" type="text" value="0" name="is-eval">
            </div>
        </div>

        <br><br><br>

        <store-in-variable style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
        `;
    },

    init() {
    },

    async action(cache) {
        const data = cache.actions[cache.index];

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {Map} */
        const map = this.getVariable(storage, varName, cache);
        const key = this.evalIfPossible(data.key, cache);
        const defaultVal = this.evalIfPossible(data.defaultVal, cache);

        const value = map.has(key) ? map.get(key) : defaultVal;

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(value, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
