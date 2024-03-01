/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Generate Sequence [DBM German]",
    displayName: "Generate Sequence",
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

    fields: ["seed", "next", "storage", "varName"],

    html(_isEvent, _data) {
        return `
        <div style="display: flex; flex-direction: column; align-items: stretch; height: calc(100vh - 220px);">
            <div style="flex: 1;">
                <span class="dbminputlabel">
                    <span>Seed Function</span>
                    <help-icon dialogTitle="Seed Function Help" dialogWidth="360" dialogHeight="100" type="0">
                        Generates an initial value which is used as the first item and provided to the <span class="help_highlightText">Next Function</span> for further values.
                    </help-icon>
                </span>
                <br>
                <textarea id="seed" name="is-eval" style="white-space: nowrap; resize: none; height: 100%;" placeholder="Leave blank for none..."></textarea>
            </div>
            <br><br>
            <div style="flex: 1;">
                <span class="dbminputlabel">
                    <span>Next Function</span>
                    <help-icon dialogTitle="Next Function Help" dialogWidth="360" dialogHeight="155" type="0">
                        Generates values for the sequence. If a <span class="help_highlightText">Seed Function</span> is provided, it has access the previously added <span class="help_highlightText">item</span> (the initial value at first).
                        Once a null value (either <span class="help_highlightText">null</span> or <span class="help_highlightText">undefined</span>) is returned, the sequence is complete and the next action will be called.
                    </help-icon>
                </span>
                <br>
                <textarea id="next" name="is-eval" style="white-space: nowrap; resize: none; height: 100%;"></textarea>
            </div>
            <br><br>
        </div>

        <store-in-variable selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
        `;
    },

    init() {
    },

    action(cache) {
        const data = cache.actions[cache.index];
        const { generateSequence, emptySequence } = require("sequency");

        const seedFn = data.seed.trim().length > 0
            ? this.eval(`() => (${data.seed})`, cache, true) || null
            : null;
        const nextFn = seedFn
            ? this.eval(`(item) => (${data.next})`, cache, true) || null
            : this.eval(`() => (${data.next})`, cache, true) || null;

        let sequence;

        try {
            if (seedFn) {
                sequence = generateSequence(seedFn, nextFn);
            } else {
                sequence = generateSequence(nextFn);
            }
        } catch (error) {
            this.displayError(data, cache, error);
            sequence = emptySequence();
        }

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(sequence, storage, varName, cache);
        this.callNextAction(cache);
    }
};
