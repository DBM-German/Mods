/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

const OPERATIONS = {
    first: "First",
    last: "Last",
    findFirst: "Find First",
    findLast: "Find Last",
    single: "Find Single",
    elementAt: "Position",
    max: "Max",
    maxBy: "Max By",
    maxByData: "Max By Data",
    maxWith: "Max With",
    min: "Min",
    minBy: "Min By",
    minByData: "Min By Data",
    minWith: "Min With",
    random: "Random"
};

const OPERATION_FIELD_CONTAINERS = [
    "numberContainer",
    "selectorContainer",
    "dataSelectorContainer",
    "predicateContainer",
    "comparisonContainer"
];

/** @type {Record<keyof typeof OPERATIONS, string[]> }} */
const OPERATION_FIELD_CONTAINER_MAPPINGS = {
    first: [],
    last: [],
    findFirst: ["predicateContainer"],
    findLast: ["predicateContainer"],
    single: ["predicateContainer"],
    elementAt: ["numberContainer"],
    max: [],
    maxBy: ["selectorContainer"],
    maxByData: ["dataSelectorContainer"],
    maxWith: ["comparisonContainer"],
    min: [],
    minBy: ["selectorContainer"],
    minByData: ["dataSelectorContainer"],
    minWith: ["comparisonContainer"],
    random: []
};

/** @type {Record<keyof typeof OPERATIONS, string> }} */
const OPERATION_HELP_TEXTS = {
    first: `
    Stores the first item or <span class="help_highlightText">null</span>.
    `,
    last: `
    Stores the last item or <span class="help_highlightText">null</span>.
    `,
    findFirst: `
    Stores the first item matching the <span class="help_highlightText">Predicate Function</span> or <span class="help_highlightText">null</span> otherwise.
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
                    <td>Predicate Function</td>
                    <td>
                        <ul>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Boolean</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    findLast: `
    Stores the last item matching the <span class="help_highlightText">Predicate Function</span> or <span class="help_highlightText">null</span> otherwise.
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
                    <td>Predicate Function</td>
                    <td>
                        <ul>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Boolean</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    single: `
    Stores the single item matching the <span class="help_highlightText">Predicate Function</span> or <span class="help_highlightText">null</span> if more or less than one item fulfill the comparison.
    `,
    elementAt: `
    Stores the item at the position (zero-based <span class="help_highlightText">Number</span>) or <span class="help_highlightText">null</span> if the position is out of bounds.
    <br><br>
    <b>Options</b>
    <div class="help_textContainer">
        <table class="options-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th>Position</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Number</td>
                    <td>0..n</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    max: `
    Stores the maximum item or <span class="help_highlightText">null</span> if sequence is empty.
    `,
    maxBy: `
    Stores the maximum item by comparing the results of the given <span class="help_highlightText">Selector Function</span> for each item of the sequence or <span class="help_highlightText">null</span> if the sequence is empty.
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
    maxByData: `
    Stores the maximum item by comparing the value associated to the given <span class="help_highlightText">Data Name</span>.
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
    maxWith: `
    Stores the maximum item by evaluating the given <span class="help_highlightText">Comparison Functions</span> or <span class="help_highlightText">null</span> if the sequence is empty.
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
                    <td>Comparison Function</td>
                    <td>
                        <ul>
                            <li>a</li>
                            <li>b</li>
                        </ul>
                    </td>
                    <td>Boolean</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    min: `
    Stores the minimum item or <span class="help_highlightText">null</span> if the sequence is empty.
    `,
    minBy: `
    Stores the minimum item by comparing the results of the given <span class="help_highlightText">Selector Function</span> for each item of the sequence or <span class="help_highlightText">null</span> if the sequence is empty.
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
    minByData: `
    Stores the minimum item by comparing the value associated to the given <span class="help_highlightText">Data Name</span>.
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
    minWith: `
    Stores the minimum item by evaluating the given <span class="help_highlightText">Comparison Functions</span> or <span class="help_highlightText">null</span> if the sequence is empty.
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
                    <td>Comparison Function</td>
                    <td>
                        <ul>
                            <li>a</li>
                            <li>b</li>
                        </ul>
                    </td>
                    <td>Boolean</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    random: `
    Stores an item at a random position or <span class="help_highlightText">null</span> if the sequence is empty.
    `
};

/** @type {DBMAction} */
module.exports = {
    name: "Get Item from Sequence [DBM German]",
    displayName: "Get Item from Sequence",
    section: "Sequences",

    subtitle(data, presets) {
        return `Get Item from ${presets.getVariableText(data.storage, data.varName)}`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "Unknown Type"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop(),
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "operation", "restore", "number", "selector", "dataName", "dataDefaultVal", "predicate", "comparison", "storage2", "varName2"],

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
            <div id="numberContainer" style="display:none;">
                <span class="dbminputlabel">Number</span><br>
                <input id="number" class="round" type="text" name="is-eval"><br>
            </div>
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
            <div id="predicateContainer" style="display:none;">
                <span class="dbminputlabel">Predicate Function</span><br>
                <input id="predicate" class="round" type="text" name="is-eval"><br>
            </div>
            <div id="comparisonContainer" style="display:none;">
                <span class="dbminputlabel">
                    <span>Comparison Function</span>
                    <help-icon dialogTitle="Comparison Function Help" dialogWidth="400" dialogHeight="140" type="0">
                        A Comparison Function returns either a negative number if the first value (<span class="help_highlightText">a</span>) is lower than the second value (<span class="help_highlightText">b</span>),
                        a positive number if the first value is larger than the second value and zero if both values are equal.
                    </help-icon>
                </span>
                <br>
                <input id="comparison" class="round" type="text" name="is-eval">
                <br>
            </div>
        </div>

        <store-in-variable dropdownLabel="Store Item In" style="padding-top: 8px;" selectId="storage2" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
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
        const number = parseInt(this.evalIfPossible(data.number, cache), 10);
        const selectorFn = this.eval(`(item) => (${data.selector || "item"})`, cache, true) || null;
        const dataName = this.evalMessage(data.dataName, cache);
        const dataDefaultVal = this.evalIfPossible(data.dataDefaultVal, cache);
        const predicateFn = this.eval(`(item) => (${data.predicate || "!!item"})`, cache, true) || null;
        const comparisonFn = this.eval(`(a, b) => (${data.comparison})`, cache, true) || null;

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
                case "first":
                    result = (itemList ? itemList.at(0) : sequence.firstOrNull()) ?? null;
                    break;
                case "last":
                    result = (itemList ? itemList.at(-1) : sequence.lastOrNull()) ?? null;
                    break;
                case "findFirst":
                    result = sequence.find(predicateFn);
                    break;
                case "findLast":
                    result = sequence.findLast(predicateFn);
                    break;
                case "single":
                    result = sequence.singleOrNull(predicateFn);
                    break;
                case "elementAt":
                    result = (itemList ? itemList.at(number) : sequence.elementAtOrNull(number)) ?? null;
                    break;
                case "max":
                    result = sequence.max();
                    break;
                case "maxBy":
                    result = sequence.maxBy(selectorFn);
                    break;
                case "maxByData":
                    result = sequence.maxBy(item => item?.data?.(dataName, dataDefaultVal));
                    break;
                case "maxWith":
                    result = sequence.maxWith(comparisonFn);
                    break;
                case "min":
                    result = sequence.min();
                    break;
                case "minBy":
                    result = sequence.minBy(selectorFn);
                    break;
                case "minByData":
                    result = sequence.minBy(item => item?.data?.(dataName, dataDefaultVal));
                    break;
                case "minWith":
                    result = sequence.minWith(comparisonFn);
                    break;
                case "random": {
                    result = (itemList ?? sequence.toArray()).at(Math.floor(Math.random() * itemList.length)) ?? null;
                    break;
                }
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
