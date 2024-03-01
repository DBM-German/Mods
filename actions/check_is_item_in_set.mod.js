/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

/** @type {DBMAction} */
module.exports = {
    name: "Check is Item in Set [DBM German]",
    displayName: "Check is Item in Set",
    section: "Conditions",

    subtitle(data, presets) {
        return presets.getConditionsText(data);
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop(),
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "restore", "comparison", "value", "branch"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Set" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

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
                    <option value="code">Custom Code</option>
                </select>
            </div>
            <div style="float: right; width: 60%;" id="valueContainer">
                <span id="valueLabel" class="dbminputlabel"></span><br>
                <input id="value" class="round" type="text" name="is-eval">
            </div>
        </div>

        <br><br><br><br>

        <hr class="subtlebar">

        <br>

        <conditional-input id="branch" style="padding-top: 8px;"></conditional-input>
        `;
    },

    init() {
        const { glob, document } = this;

        glob.onComparisonChanged = function(event) {
            document.getElementById("valueContainer").style.display = event.value === "0" ? "none" : null;
            document.getElementById("valueLabel").innerText = event.value === "code" ? "Predicate Function" : "Value to Compare to";
        };

        glob.onComparisonChanged(/** @type {HTMLSelectElement} */ (document.getElementById("comparison")));
    },

    action(cache) {
        const data = cache.actions[cache.index];

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {Set} */
        const set = this.getVariable(storage, varName, cache);

        const comparison = data.comparison;

        let value;

        if (comparison === "6") {
            value = data.value;
        } else if (comparison === "code") {
            value = this.eval(`(item) => (${data.value || "!!item"})`, cache, true);
        } else {
            value = this.evalIfPossible(data.value, cache);
        }

        let contains = false;

        try {
            if (comparison === "2") {
                contains = set.has(value);
            } else {
                for (const item of set.values()) {
                    switch (comparison) {
                        case "0":
                            contains = item !== undefined && item !== null;
                            break;
                        case "1":
                            contains = item == value;
                            break;
                        case "3":
                            contains = item < value;
                            break;
                        case "4":
                            contains = item > value;
                            break;
                        case "5":
                            if (typeof item?.includes === "function") {
                                contains = item.includes(value);
                            }
                            break;
                        case "6":
                            if (typeof item?.match === "function") {
                                contains = item.match(new RegExp("^" + value + "$", "i"));
                            }
                            break;
                        case "7":
                            if (typeof item?.startsWith === "function") {
                                contains = item.startsWith(value);
                            }
                            break;
                        case "8":
                            if (typeof item?.endsWith === "function") {
                                contains = item.endsWith(value);
                            }
                            break;
                        case "9":
                            if (typeof item?.length === "number") {
                                contains = item.length === value;
                            }
                            break;
                        case "10":
                            if (typeof item?.length === "number") {
                                contains = item.length > value;
                            }
                            break;
                        case "11":
                            if (typeof item?.length === "number") {
                                contains = item.length < value;
                            }
                            break;
                        case "code":
                            contains = !!value(item);
                            break;
                    }

                    if (contains) break;
                }
            }
        } catch (error) {
            this.displayError(data, cache, error);
        }

        this.executeResults(contains, data.branch, cache);
    }
};
