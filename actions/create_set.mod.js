/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Create Set [DBM German]",
    displayName: "Create Set",
    section: "Maps and Sets",

    subtitle(data, presets) {
        return presets.getVariableText(data.storage, data.varName);
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage, 10);
        if (type !== varType) return;
        return [data.varName, "Set"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename
    },

    fields: ["storage", "varName"],

    html(_isEvent, _data) {
        return `
        <store-in-variable selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
        `;
    },

    init() {},

    action(cache) {
        const data = cache.actions[cache.index];

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);

        this.storeValue(new Set(), storage, varName, cache);
        this.callNextAction(cache);
    }
};
