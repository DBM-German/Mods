/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

const OPERATIONS = {
    all: "All",
    any: "Any",
    none: "None"
};

/** @type {Record<keyof typeof OPERATIONS, string> }} */
const OPERATION_HELP_TEXTS = {
    all: `
    All items in the sequence have to match.
    `,
    any: `
    At least one item in the sequence has to match.
    `,
    none: `
    No item in the sequence has to match.
    `
};

/** @type {DBMAction} */
module.exports = {
    name: "Check Sequence Items [DBM German]",
    displayName: "Check Sequence Items",
    section: "Conditions",

    subtitle(data, presets) {
        return presets.getConditionsText(data);
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename,
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "restore", "comparison", "value", "branch"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Sequence" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br><br>

        <div>
            <div style="float: left; width: 45%;">
                <span class="dbminputlabel">
                    <span>Operation</span>
                    <help-icon dialogTitle="Terminal Operations Help" dialogWidth="600" dialogHeight="250" type="0">
                        ${Object.entries(OPERATION_HELP_TEXTS).map(help => `<div class="help_textContainer"><span class="help_textContainerHeader">${OPERATIONS[help[0]] ?? "Error"}</span><div class="help_text">${help[1] ?? "Error"}</div></div>`).join("<br>\n")}
                    </help-icon>
                </span>
                <br>
                <select id="operation" class="round" onchange='glob.onOperationChange(this)'>
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
        </div>

        <div>
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

        <hr class="subtlebar" style="margin-top: 0px; margin-bottom: 0px;">

        <br>

        <conditional-input id="branch" style="padding-top: 8px;"></conditional-input>
        `;
    },

    init() {
        const { glob, document } = this;

        glob.onComparisonChanged = function (event) {
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

        let match = false;

        try {
            sequence[operation](item => {
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
        } catch (error) {
            this.displayError(data, cache, error);
        }

        this.executeResults(match, data.branch, cache);
    },

    modInit(data) {
        this.prepareActions(data.branch?.iftrueActions);
        this.prepareActions(data.branch?.iffalseActions);
    }
};
