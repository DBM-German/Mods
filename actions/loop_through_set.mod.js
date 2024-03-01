/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Loop Through Set [DBM German]",
    displayName: "Loop Through Set",
    section: "Maps and Sets",

    subtitle(data, presets) {
        const list = presets.lists;
        return `Loop ${list[parseInt(data.storage, 10)]} through ${data.actions?.length ?? 0} actions.`;
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["storage", "varName", "tempVarName", "callType", "actions"],

    html(_isEvent, _data) {
        return `
        <tab-system>
            <tab label="Iteration Options" icon="align right">
                <div style="padding: 12px;">
                    <retrieve-from-variable dropdownLabel="Source Set" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
                </div>
            </tab>

            <tab label="Loop Options" icon="cogs">
                <div style="padding: 12px;">
                    <div style="display: flex; justify-content: space-between; padding-bottom: 7px;">
                        <div style="width: calc(50% - 12px);">
                            <span class="dbminputlabel">Temp Variable Name</span><br>
                            <input id="tempVarName" class="round" type="text" placeholder="Leave blank for none...">
                        </div>

                        <div style="width: calc(50% - 12px);">
                            <span class="dbminputlabel">Call Type</span><br>
                            <select id="callType" class="round">
                                <option value="0" selected>Wait for Completion</option>
                                <option value="1">Process Simultaneously</option>
                            </select>
                        </div>
                    </div>
                </div>
            </tab>
        </tab-system>

        <br><br><br><br><br><br><br><br>

        <action-list-input id="actions" height="calc(100vh - 360px)">
            <script class="setupTempVars">
                const tempVarName = document.getElementById("tempVarName");

                if (tempVarName?.value) tempVars.push([tempVarName.value, "Unknown Type"]);
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
        /** @type {Set} */
        const set = this.getVariable(storage, varName, cache);

        const tempVarName = this.evalMessage(data.tempVarName, cache);
        const callType = parseInt(data.callType, 10);
        const subActions = data.actions;

        try {
            if (callType === 0) {
                // Wait for Completion
                for (const item of set.values()) {
                    await new Promise((resolve, reject) => {
                        try {
                            this.storeValue(item, 1, tempVarName, cache);
                            this.executeSubActions(subActions, cache, resolve);
                        } catch (error) {
                            reject(error);
                        }
                    });
                }
            } else {
                // Run Simultaneously
                set.forEach(item => {
                    this.storeValue(item, 1, tempVarName, cache);
                    this.executeSubActions(subActions, cache);
                });
            }
        } catch (error) {
            this.displayError(data, cache, error);
        }
    },

    modInit(data) {
        this.prepareActions(data.actions);
    }
};
