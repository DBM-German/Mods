/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Get Map Size [DBM German]",
    displayName: "Get Map Size",
    section: "Maps and Sets",

    subtitle(data, presets) {
        return `Get ${presets.getVariableText(data.storage, data.varName)} Size`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Number"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["storage", "varName", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Map" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br>

        <store-in-variable style="padding-top: 8px;" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
        `;
    },

    init() {
    },

    action(cache) {
        const data = cache.actions[cache.index];

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {Map} */
        const map = this.getVariable(storage, varName, cache);

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(map.size, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
