/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */
/** @typedef {import("../types/dbm-2.1").DBMListType} DBMListType */

/** @type {DBMAction} */
module.exports = {
    name: "Filter List [DBM German]",
    displayName: "Filter List",
    section: "Lists and Loops",

    subtitle(data, presets) {
        return `Filter ${presets.getListText(data.list, data.varName)}`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage, 10);
        if (type !== varType) return;

        return [data.varName2, "List"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename
    },

    fields: ["list", "varName", "comparison", "value", "storage", "varName2"],

    html(isEvent, data) {
        return `
        <div>
            <div style="float: left; width: 35%;">
                Source List:<br>
                <select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
                    ${data.lists[isEvent ? 1 : 0]}
                </select>
            </div>
            <div id="varNameContainer" style="display: none; float: right; width: 60%;">
                Variable Name:<br>
                <input id="varName" class="round" type="text" list="variableList">
            </div>
        </div>

        <br><br><br>

        <div style="padding-top: 8px;">
            <div style="float: left; width: 35%;">
                <span class="dbminputlabel">Comparison Type</span><br>
                <select id="comparison" class="round" onchange="glob.onComparisonChanged(this)">
                    <option value="0">Exists</option>
                    <option value="1" selected>Equals</option>
                    <option value="2">Equals Exactly</option>
                    <option value="3">Less Than</option>
                    <option value="4">Greater Than</option>
                    <option value="5">Includes</option>
                    <option value="6">Matches Regex</option>
                    <option value="7">Starts With</option>
                    <option value="8">Ends With</option>
                    <option value="9">Length Equals</option>
                    <option value="10">Length is Greater Than</option>
                    <option value="11">Length is Less Than</option>
                </select>
            </div>
            <div style="float: right; width: 60%;" id="directValue">
                <span class="dbminputlabel">Value to Compare to</span><br>
                <input id="value" class="round" type="text" name="is-eval">
            </div>
        </div>

        <br><br><br>

        <div style="padding-top: 8px;">
            <store-in-variable allowNone selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
        </div>
        `;
    },

    init() {
        const { glob, document } = this;

        glob.listChange(document.getElementById("list"), "varNameContainer");

        glob.onComparisonChanged = function(event) {
            document.getElementById("directValue").style.display = event.value === "0" ? "none" : null;
        };

        glob.onComparisonChanged(/** @type {HTMLSelectElement} */ (document.getElementById("comparison")));
    },

    async action(cache) {
        const data = cache.actions[cache.index];
        const list = await this.getListFromData(data.list, data.varName, cache);

        const compare = parseInt(data.comparison, 10);
        let value = data.value;
        if (compare !== 6) value = this.evalIfPossible(value, cache);

        let result = list.filter(item => {
            let result = false;

            switch (compare) {
                case 0:
                    result = item !== undefined;
                    break;
                case 1:
                    result = item == value;
                    break;
                case 2:
                    result = item === value;
                    break;
                case 3:
                    result = item < value;
                    break;
                case 4:
                    result = item > value;
                    break;
                case 5:
                    if (typeof item?.includes === "function") {
                        result = item.includes(value);
                    }
                    break;
                case 6:
                    if (typeof item?.match === "function") {
                        result = Boolean(item.match(new RegExp("^" + value + "$", "i")));
                    }
                    break;
                case 7:
                    if (typeof item?.startsWith === "function") {
                        result = Boolean(item.startsWith(value));
                    }
                    break;
                case 8:
                    if (typeof item?.endsWith === "function") {
                        result = Boolean(item.endsWith(value));
                    }
                    break;
                case 9:
                    if (typeof item?.length === "number") {
                        result = Boolean(item.length === value);
                    }
                    break;
                case 10:
                    if (typeof item?.length === "number") {
                        result = Boolean(item.length > value);
                    }
                    break;
                case 11:
                    if (typeof item?.length === "number") {
                        result = Boolean(item.length < value);
                    }
                    break;
            }

            return result;
        });

        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        this.storeValue(result, storage, varName2, cache);

        this.callNextAction(cache);
    }
};
