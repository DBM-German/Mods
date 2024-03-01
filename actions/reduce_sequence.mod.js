/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Reduce Sequence [DBM German]",
    displayName: "Reduce Sequence",
    section: "Sequences",

    subtitle(data, presets) {
        return `Reduce ${presets.getVariableText(data.storage, data.varName)}`;
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
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop(),
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "restore", "initial", "indexed", "accumulator", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Sequence" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br><br>

        <div>
            <div style="width: 35%;">
                <span class="dbminputlabel">
                    <span>Restore Sequence</span>
                    <help-icon dialogTitle="Restore Sequence Help" dialogWidth="360" dialogHeight="230" type="0">
                        This action executes a so called "terminal operation" on the sequence, meaning that its values get converted to an arbitrary result which destroys the sequence.
                        Because of this, the sequence gets deleted by default before calling the next action.
                        This behaviour can be changed by enabling the "Restore" option, which recreates the sequence after executing the operation.<br>
                        <strong>However, because this is very inefficient, it is disabled by default!</strong>
                    </help-icon>
                </span>
                <br>
                <select id="restore" class="round">
                    <option value="true">Yes</option>
                    <option value="false" selected>No</option>
                </select>
                <br>
            </div>
            <div style="padding-bottom: 9px;">
                <div style="float: left; width: calc(65% - 12px);">
                    <span class="dbminputlabel">Initial Value</span><br>
                    <input id="initial" class="round" type="text" name="is-eval" placeholder="Leave empty to use first item in the sequence...">
                </div>
                <div style="float: right; width: calc(35% - 12px);">
                    <span class="dbminputlabel">With Index</span><br>
                    <select id="indexed" class="round">
                        <option value="true">Yes</option>
                        <option value="false" selected>No</option>
                    </select>
                </div>
                <br><br><br>
            </div>
            <div>
                <span class="dbminputlabel">
                    <span>Accumulator Function</span>
                    <help-icon dialogTitle="Accumulator Function Help" dialogWidth="400" dialogHeight="100" type="0">
                        Returns an accumulated value based on the currently accumulated value (<span class="help_highlightText">acc</span>),
                        a new <span class="help_highlightText">item</span> and optionally the current <span class="help_highlightText">index</span>.
                    </help-icon>
                </span>
                <br>
                <input id="accumulator" class="round" type="text" name="is-eval">
                <br>
            </div>
        </div>

        <store-in-variable style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
        `;
    },

    init() {
    },

    action(cache) {
        const data = cache.actions[cache.index];
        const { asSequence } = require("sequency");

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {import("sequency").default} */
        let sequence = this.getVariable(storage, varName, cache);

        const restore = data.restore === "true";
        const initial = this.evalIfPossible(data.initial, cache);
        const indexed = data.indexed === "true";
        const accumulatorFn = this.eval(`(acc, item) => (${data.accumulator || "item"})`, cache, true) || null;
        const accumulatorWithIndexFn = this.eval(`(index, acc, item) => (${data.accumulator || "item"})`, cache, true) || null;

        let itemList;

        if (restore) {
            itemList = sequence.toArray();

            // Store a copy of all items and re-create sequence for internal use
            sequence = asSequence(itemList);
            // Re-create sequence
            this.storeValue(asSequence(itemList), storage, varName, cache);
        } else {
            // Delete sequence
            this.storeValue(undefined, storage, varName, cache);
        }

        let result;

        try {
            if (initial !== undefined && initial !== null) {
                if (indexed) {
                    result = sequence.foldIndexed(initial, accumulatorWithIndexFn);
                } else {
                    result = sequence.fold(initial, accumulatorFn);
                }
            } else {
                if (indexed) {
                    result = sequence.reduceIndexed(accumulatorWithIndexFn);
                } else {
                    result = sequence.reduce(accumulatorFn);
                }
            }
        } catch (error) {
            this.displayError(data, cache, error);
        }

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(result, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
