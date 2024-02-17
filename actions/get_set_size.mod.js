/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Get Set Size [DBM German]",
    displayName: "Get Set Size",
    section: "Maps and Sets",

    subtitle(data, presets) {
        return `Get ${presets.getVariableText(data.storage, data.varName)} Size`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Number"];
    },

    meta: { version: "2.1.7", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

    fields: ["storage", "varName", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Set" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

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
        /** @type {Set} */
        const set = this.getVariable(storage, varName, cache);

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(set.size, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
