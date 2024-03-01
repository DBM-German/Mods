/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

const OPERATIONS = {
    indexOfFirst: "Find First",
    indexOfLast: "Find Last"
};

/** @type {Record<keyof typeof OPERATIONS, string> }} */
const OPERATION_HELP_TEXTS = {
    indexOfFirst: `
    Stores the position (zero-based) of the first item fulfilling the given comparison or <span class="help_highlightText">-1</span> if no item fulfills it.
    `,
    indexOfLast: `
    Stores the position (zero-based) of the last item fulfilling the given comparison or <span class="help_highlightText">-1</span> if no item fulfills it.
    `
};

/** @type {DBMAction} */
module.exports = {
    name: "Find Item in Sequence [DBM German]",
    displayName: "Find Item in Sequence",
    section: "Sequences",

    subtitle(data, presets) {
        return `Find Item in ${presets.getVariableText(data.storage, data.varName)}`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Number"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop(),
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "operation", "restore", "comparison", "value", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Sequence" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br><br>

        <div>
            <div style="float: left; width: 45%;">
                <span class="dbminputlabel">
                    <span>Operation</span>
                    <help-icon dialogTitle="Terminal Operations Help" dialogWidth="600" dialogHeight="220" type="0">
                        ${Object.entries(OPERATION_HELP_TEXTS).map(help => `<div class="help_textContainer"><span class="help_textContainerHeader">${OPERATIONS[help[0]] ?? "Error"}</span><div class="help_text">${help[1] ?? "Error"}</div></div>`).join("<br>\n")}
                    </help-icon>
                </span>
                <br>
                <select id="operation" class="round">
                    ${Object.entries(OPERATIONS).map(op => `<option value="${op[0]}">${op[1]}</option>`).join("\n")}
                </select>
            </div>
            <div style="float: right; width: 35%;">
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
            <br><br><br><br>
            <div style="padding-bottom: 11px;">
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
            <br><br><br>
        </div>

        <store-in-variable dropdownLabel="Store Position In" style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
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
        const { asSequence } = require("sequency");

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {import("sequency").default} */
        let sequence = this.getVariable(storage, varName, cache);

        /** @type {keyof typeof OPERATIONS} */
        const operation = data.operation;
        const restore = data.restore === "true";
        const comparison = data.comparison;

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

        let value;

        if (comparison === "6") {
            value = data.value;
        } else if (comparison === "code") {
            value = this.eval(`(item) => (${data.value || "!!item"})`, cache, true);
        } else {
            value = this.evalIfPossible(data.value, cache);
        }

        let position = -1;

        try {
            if (comparison === "2" && operation === "indexOfFirst") {
                position = sequence.indexOf(value);
            } else {
                position = sequence[operation](item => {
                    let result = false;

                    switch (comparison) {
                        case "0":
                            result = item !== undefined && item !== null;
                            break;
                        case "1":
                            result = item == value;
                            break;
                        case "2":
                            result = item === value;
                            break;
                        case "3":
                            result = item < value;
                            break;
                        case "4":
                            result = item > value;
                            break;
                        case "5":
                            if (typeof item?.includes === "function") {
                                result = item.includes(value);
                            }
                            break;
                        case "6":
                            if (typeof item?.match === "function") {
                                result = item.match(new RegExp("^" + value + "$", "i"));
                            }
                            break;
                        case "7":
                            if (typeof item?.startsWith === "function") {
                                result = item.startsWith(value);
                            }
                            break;
                        case "8":
                            if (typeof item?.endsWith === "function") {
                                result = item.endsWith(value);
                            }
                            break;
                        case "9":
                            if (typeof item?.length === "number") {
                                result = item.length === value;
                            }
                            break;
                        case "10":
                            if (typeof item?.length === "number") {
                                result = item.length > value;
                            }
                            break;
                        case "11":
                            if (typeof item?.length === "number") {
                                result = item.length < value;
                            }
                            break;
                        case "code":
                            result = !!value(item);
                            break;
                    }

                    return result;
                });
            }
        } catch (error) {
            this.displayError(data, cache, error);
        }

        const storage2 = /** @type {DBMVarType} */ (parseInt(data.storage2, 10));
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(position, storage2, varName2, cache);
        this.callNextAction(cache);
    }
};
