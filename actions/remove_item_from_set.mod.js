/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Remove Item from Set [DBM German]",
    displayName: "Remove Item from Set",
    section: "Maps and Sets",

    subtitle(data, presets) {
        return `Remove "${data.value}" from ${presets.getVariableText(data.storage, data.varName)}`;
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename
    },

    fields: ["storage", "varName", "value"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Set" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br>

        <div style="padding-top: 8px;">
            <span class="dbminputlabel">Value</span><br>
            <input id="value" class="round" type="text" name="is-eval">
        </div>
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

        let value = this.evalMessage(data.value, cache);
        try {
            value = this.eval(value, cache);
        } catch (e) {
            this.displayError(data, cache, e);
        }

        set.delete(value);

        this.callNextAction(cache);
    }
};
