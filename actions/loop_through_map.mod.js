/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Loop Through Map [DBM German]",
    displayName: "Loop Through Map",
    section: "Maps and Sets",

    subtitle(data, presets) {
        const actions = data.actions?.length ?? 0;
        return `Loop ${presets.getVariableText(data.storage, data.varName)} through ${actions} action${actions === 1 ? "" : "s"}.`;
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["storage", "varName", "keyVarName", "valueVarName", "callType", "actions"],

    html(_isEvent, _data) {
        return `
        <tab-system>
            <tab label="Iteration Options" icon="align right">
                <div style="padding: 12px;">
                    <retrieve-from-variable dropdownLabel="Source Map" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
                </div>
            </tab>

            <tab label="Loop Options" icon="cogs">
                <div style="padding: 12px; display: flex; flex-wrap: wrap; justify-content: space-between; row-gap: 16px;">
                    <div style="width: calc(50% - 12px);">
                        <span class="dbminputlabel">Key Variable Name</span><br>
                        <input id="keyVarName" class="round" type="text" placeholder="Leave blank for none...">
                    </div>
                    <div style="width: calc(50% - 12px);">
                        <span class="dbminputlabel">Call Type</span><br>
                        <select id="callType" class="round">
                            <option value="0" selected>Wait for Completion</option>
                            <option value="1">Process Simultaneously</option>
                        </select>
                    </div>
                    <div style="width: calc(50% - 12px);">
                        <span class="dbminputlabel">Value Variable Name</span><br>
                        <input id="valueVarName" class="round" type="text" placeholder="Leave blank for none...">
                    </div>
                </div>
            </tab>
        </tab-system>

        <br><br><br><br><br><br><br><br><br><br><br>

        <action-list-input id="actions" height="calc(100vh - 420px)">
            <script class="setupTempVars">
                const keyVarName = document.getElementById("keyVarName");
                const valueVarName = document.getElementById("valueVarName");

                if (keyVarName?.value) tempVars.push([keyVarName.value, "Unknown Type"]);
                if (valueVarName?.value) tempVars.push([valueVarName.value, "Unknown Type"]);
            </script>
        </action-list-input>
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

        const keyVarName = this.evalMessage(data.keyVarName, cache);
        const valueVarName = this.evalMessage(data.valueVarName, cache);
        const callType = parseInt(data.callType, 10);
        const subActions = data.actions;

        try {
            if (callType === 0) {
                // Wait for Completion
                for (const entry of map.entries()) {
                    await new Promise((resolve, reject) => {
                        try {
                            this.storeValue(entry[0], 1, keyVarName, cache);
                            this.storeValue(entry[1], 1, valueVarName, cache);
                            this.executeSubActions(subActions, cache, resolve);
                        } catch (error) {
                            reject(error);
                        }
                    });
                }
            } else {
                // Run Simultaneously
                map.forEach((value, key) => {
                    this.storeValue(key, 1, keyVarName, cache);
                    this.storeValue(value, 1, valueVarName, cache);
                    this.executeSubActions(subActions, cache);
                });
            }
        } catch (error) {
            this.displayError(data, cache, error);
        }

        this.callNextAction(cache);
    },

    modInit(data) {
        this.prepareActions(data.actions);
    }
};
