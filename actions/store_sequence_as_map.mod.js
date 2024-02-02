/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

const OPERATIONS = {
    associate: "Associate",
    associateBy: "Associate By",
    associateByData: "Associate By Data",
    groupBy: "Group By",
    groupByData: "Group By Data",
    toMap: "Unzip"
};

const OPERATION_FIELD_CONTAINERS = [
    "selectorContainer",
    "dataSelectorContainer",
    "transformContainer"
];

/** @type {Record<keyof typeof OPERATIONS, string[]> }} */
const OPERATION_FIELD_CONTAINER_MAPPINGS = {
    associate: ["transformContainer"],
    associateBy: ["selectorContainer"],
    associateByData: ["dataSelectorContainer"],
    groupBy: ["selectorContainer"],
    groupByData: ["dataSelectorContainer"],
    toMap: []
};

/** @type {Record<keyof typeof OPERATIONS, string> }} */
const OPERATION_HELP_TEXTS = {
    associate: `
    Transforms each item into a key-value pair and then stores those in a map. In case of duplicate keys the last key-value pair overrides the other.
    `,
    associateBy: `
    Stores a map consisting of the items mapped by the result of the given <span class="help_highlightText">Selector Function</span>.
    <br><br>
    <b>Options</b>
    <div class="help_textContainer">
        <table class="options-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th>Parameters</th>
                    <th>Return Type</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Selector Function</td>
                    <td>
                        <ul>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Anything</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    associateByData: `
    Stores a map consisting of the items mapped to the values associated to the given <span class="help_highlightText">Data Name</span>.
    <br><br>
    <b>Options</b>
    <div class="help_textContainer">
        <table class="options-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th>Data Type</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Data Name</td>
                    <td>Text</td>
                </tr>
                <tr>
                    <td>Default Value</td>
                    <td>Anything</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    groupBy: `
    Groups all elements of the sequence into a map, where the keys are determined by the given <span class="help_highlightText">Selector Function</span>.
    <br><br>
    <b>Options</b>
    <div class="help_textContainer">
        <table class="options-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th>Parameters</th>
                    <th>Return Type</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Selector Function</td>
                    <td>
                        <ul>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Anything</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    groupByData: `
    Groups all elements of the sequence into a map, where the keys are determined by the values associated to the given <span class="help_highlightText">Data Name</span>.
    <br><br>
    <b>Options</b>
    <div class="help_textContainer">
        <table class="options-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th>Data Type</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Data Name</td>
                    <td>Text</td>
                </tr>
                <tr>
                    <td>Default Value</td>
                    <td>Anything</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    toMap: `
    Stores a map consisting of each key-value pair in the zipped sequence.
    `
};

/** @type {DBMAction} */
module.exports = {
    name: "Store Sequence as Map [DBM German]",
    displayName: "Store Sequence as Map",
    section: "Sequences",

    subtitle(data, presets) {
        return `Store ${presets.getVariableText(data.storage, data.varName)} as Map`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Map"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename,
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "operation", "restore", "number", "predicate", "storage2", "varName2"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Sequence" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br><br>

        <div>
            <div style="float: left; width: 45%;">
                <span class="dbminputlabel">
                    <span>Operation</span>
                    <help-icon dialogTitle="Terminal Operations Help" dialogWidth="600" dialogHeight="600" type="0">
                        <style>
                            table.options-table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            table.options-table td, table.options-table th {
                                border: 1px solid #aaa;
                                padding: 5px;
                            }
                            table.options-table tr:first-child th {
                                border-top: none;
                            }
                            table.options-table tr:last-child td {
                                border-bottom: none;
                            }
                            table.options-table tr th:first-child, table.options-table tr td:first-child {
                                border-left: none;
                            }
                            table.options-table tr th:last-child, table.options-table tr td:last-child {
                                border-right: none;
                            }
                            table.options-table ul {
                                margin: 0px;
                                padding-left: 16px;
                            }
                        </style>
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
            <div id="selectorContainer" style="display:none;">
                <span class="dbminputlabel">Selector Function</span><br>
                <input id="selector" class="round" type="text" name="is-eval"><br>
            </div>
            <div id="dataSelectorContainer" style="padding-bottom: 9px; display:none;">
                <div style="float: left; width: calc(35% - 12px);">
                    <span class="dbminputlabel">Data Name</span><br>
                    <input id="dataName" class="round" type="text">
                </div>
                <div style="float: right; width: calc(65% - 12px);">
                    <span class="dbminputlabel">Default Value (if data doesn't exist)</span><br>
                    <input id="dataDefaultVal" class="round" type="text" value="0">
                </div>
                <br><br><br>
            </div>
            <div id="transformContainer" style="display:none;">
                <span class="dbminputlabel">Transform Function</span><br>
                <input id="transform" class="round" type="text" name="is-eval"><br>
            </div>
        </div>

        <store-in-variable style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
        `;
    },

    init() {
        const { glob, document } = this;
        const operationSelect = /** @type {HTMLSelectElement} */ (document.querySelector("select[id=\"operation\"]"));

        glob.onOperationChange = function(event) {
            for (const operationFieldContainer of OPERATION_FIELD_CONTAINERS) {
                document.getElementById(operationFieldContainer).style.display = "none";
            }

            for (const operationFieldContainerMapping of OPERATION_FIELD_CONTAINER_MAPPINGS[event.value]) {
                document.getElementById(operationFieldContainerMapping).style.display = null;
            }
        };

        glob.onOperationChange(operationSelect);
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
        const selectorFn = this.eval(`(item) => (${data.selector || "item"})`, cache, true) || null;
        const dataName = this.evalMessage(data.dataName, cache);
        const dataDefaultVal = this.evalIfPossible(data.dataDefaultVal, cache);
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
            switch (operation) {
                case "associate":
                    result = sequence.associate(transformFn);
                    break;
                case "associateBy":
                    result = sequence.associateBy(selectorFn);
                    break;
                case "associateByData":
                    result = sequence.associateBy(item => item?.data?.(dataName, dataDefaultVal));
                    break;
                case "groupBy":
                    result = sequence.groupBy(selectorFn);
                    break;
                case "groupByData":
                    result = sequence.groupBy(item => item?.data?.(dataName, dataDefaultVal));
                    break;
                case "toMap":
                    result = sequence.toMap();
                    break;
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
