/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Loop Through Sequence [DBM German]",
    displayName: "Loop Through Sequence",
    section: "Sequences",

    subtitle(data, presets) {
        const actions = data.actions?.length ?? 0;
        return `Loop ${presets.getVariableText(data.storage, data.varName)} through ${actions} action${actions === 1 ? "" : "s"}.`;
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop(),
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "restore", "itemVarName", "posVarName", "callType", "actions"],

    html(_isEvent, _data) {
        return `
        <tab-system>
            <tab label="Iteration Options" icon="align right">
                <div style="padding: 12px">
                    <retrieve-from-variable dropdownLabel="Source Sequence" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
                    <br><br><br>
                    <div style="padding-top: 6px; width: 35%;">
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
                    </div>
                </div>
            </tab>
            <tab label="Loop Options" icon="cogs">
                <div style="padding: 12px; display: flex; flex-wrap: wrap; justify-content: space-between; row-gap: 16px;">
                    <div style="width: calc(50% - 12px);">
                        <span class="dbminputlabel">Item Variable Name</span><br>
                        <input id="itemVarName" class="round" type="text" placeholder="Leave blank for none...">
                    </div>
                    <div style="width: calc(50% - 12px);">
                        <span class="dbminputlabel">Call Type</span><br>
                        <select id="callType" class="round">
                            <option value="0" selected>Wait for Completion</option>
                            <option value="1">Process Simultaneously</option>
                        </select>
                    </div>
                    <div style="width: calc(50% - 12px);">
                        <span class="dbminputlabel">Position Variable Name</span><br>
                        <input id="posVarName" class="round" type="text" placeholder="Leave blank for none...">
                    </div>
                </div>
            </tab>
        </tab-system>

        <br><br><br><br><br><br><br><br><br><br><br>

        <action-list-input id="actions" height="calc(100vh - 420px)">
            <script class="setupTempVars">
                const itemVarName = document.getElementById("itemVarName");
                const posVarName = document.getElementById("posVarName");

                if (itemVarName?.value) tempVars.push([itemVarName.value, "Unknown Type"]);
                if (posVarName?.value) tempVars.push([posVarName.value, "Number"]);
            </script>
        </action-list-input>
        `;
    },

    init() {
        // document.querySelectorAll(".tab-content")[1].getBoundingClientRect()
    },

    async action(cache) {
        const data = cache.actions[cache.index];
        const { asSequence } = require("sequency");

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {import("sequency").default} */
        let sequence = this.getVariable(storage, varName, cache);

        const restore = data.restore === "true";
        const itemVarName = this.evalMessage(data.itemVarName, cache);
        const posVarName = this.evalMessage(data.posVarName, cache);
        const callType = parseInt(data.callType, 10);
        const subActions = data.actions;

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

        try {
            if (callType === 0) {
                // Wait for Completion
                let index = -1;
    
                for (const item of sequence.asIterable()) {
                    await new Promise((resolve, reject) => {
                        try {
                            this.storeValue(item, 1, itemVarName, cache);
                            if (posVarName) this.storeValue(++index, 1, posVarName, cache);
                            this.executeSubActions(subActions, cache, resolve);
                        } catch (error) {
                            reject(error);
                        }
                    });
                }
            } else {
                // Run Simultaneously
                if (posVarName) {
                    sequence.forEachIndexed((item, index) => {
                        this.storeValue(item, 1, itemVarName, cache);
                        this.storeValue(index, 1, posVarName, cache);
                        this.executeSubActions(subActions, cache);
                    });
                } else {
                    sequence.forEach(item => {
                        this.storeValue(item, 1, itemVarName, cache);
                        this.executeSubActions(subActions, cache);
                    });
                }
            }
        } catch (error) {
            this.displayError(data, cache, error);
        }

        this.callNextAction(cache);
    }
};
