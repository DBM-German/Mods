/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Convert Sequence to Text [DBM German]",
    displayName: "Convert Sequence to Text",
    section: "Sequences",

    subtitle(data, presets) {
        return `Convert ${presets.getVariableText(data.storage, data.varName)} to Text`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Text"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename,
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "restore", "prefix", "separator", "postfix", "limit", "truncated", "transform", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Sequence" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br><br>

        <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">Prefix</span><br>
                <input id="prefix" class="round" type="text" placeholder="Leave blank for none..."><br>
            </div>
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">Separator</span><br>
                <input id="separator" class="round" type="text" value=", " placeholder="Leave blank for none..."><br>
            </div>
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">Postfix</span><br>
                <input id="postfix" class="round" type="text" placeholder="Leave blank for none..."><br>
            </div>
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">Limit</span><br>
                <input id="limit" class="round" type="text" min="0" placeholder="Leave blank for none..."><br>
            </div>
            <div style="width: calc(35% - 4vw);">
                <span class="dbminputlabel">Truncation Indicator</span><br>
                <input id="truncated" class="round" type="text" value="..." placeholder="Leave blank for none..."><br>
            </div>
            <div style="width: calc(35% - 4vw);">
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
        </div>

        <div>
            <span class="dbminputlabel">
                <span>Transform Function</span>
                <help-icon dialogTitle="Transform Function Help" dialogWidth="360" dialogHeight="100" type="0">
                    Transforms each <span class="help_highlightText">item</span> into another value.
                    Transformations into null values (either <span class="help_highlightText">null</span> or <span class="help_highlightText">undefined</span>) are <strong>not</strong> discarded.
                </help-icon>
            </span>
            <br>
            <input id="transform" class="round" type="text" name="is-eval" placeholder="Leave blank to retain items...">
            <br>
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
        const prefix = this.evalMessage(data.prefix, cache);
        const separator = this.evalMessage(data.separator, cache);
        const postfix = this.evalMessage(data.postfix, cache);
        const limit = parseInt(this.evalMessage(data.limit || "-1", cache), 10);
        const truncated = this.evalMessage(data.truncated, cache);
        const transformFn = this.eval(`(item) => (${data.transform})`, cache, true) || null;

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
            result = sequence.joinToString({ prefix, separator, postfix, limit, truncated, transform: transformFn });
        } catch (error) {
            this.displayError(data, cache, error);
        }

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(result, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
