/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

const OPERATIONS = {
    toArray: "One List",
    chunk: "Chunks",
    partition: "Partitions",
    unzip: "Unzip"
};

const OPERATION_FIELD_CONTAINERS = [
    "sizeContainer",
    "predicateContainer"
];

/** @type {Record<keyof typeof OPERATIONS, string[]> }} */
const OPERATION_FIELD_CONTAINER_MAPPINGS = {
    toArray: [],
    chunk: ["sizeContainer"],
    partition: ["predicateContainer"],
    unzip: []
};

/** @type {Record<keyof typeof OPERATIONS, string> }} */
const OPERATION_HELP_TEXTS = {
    toArray: `
    Stores all items in the sequence as one list.
    `,
    chunk: `
    Splits the items in the sequence into separate lists whose length is determined by the specified <span class="help_highlightText">Size</span> and then stores all chunks in a list.
    <br><br>
    <b>Options</b>
    <div class="help_textContainer">
        <table class="options-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Size</td>
                    <td>1..n</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    partition: `
    Assorts each item into one of two lists according to the result of the given <span class="help_highlightText">Predicate Function</span> and then stores both partitions in the result list,
    where <span class="help_highlightText">false</span> values are at position <span class="help_highlightText">0</span> and <span class="help_highlightText">true</span> values at position <span class="help_highlightText">1</span>.
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
    unzip: `
    Assorts the key and value of each key-value pair in the zipped sequence into two separate lists and then stores both of them in the result list,
    where the key set is at position <span class="help_highlightText">0</span> and the values set at position <span class="help_highlightText">1</span>.
    `
};

/** @type {DBMAction} */
module.exports = {
    name: "Store Sequence as List [DBM German]",
    displayName: "Store Sequence as List",
    section: "Sequences",

    subtitle(data, presets) {
        return `Store ${presets.getVariableText(data.storage, data.varName)} as List`;
    },

    variableStorage(data, varType) {
        const type = parseInt(data.storage2, 10);
        if (type !== varType) return;
        return [data.varName2, "List"];
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename,
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "operation", "restore", "size", "predicate", "storage2", "varName2"],

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
            <div id="sizeContainer" style="display:none;">
                <span class="dbminputlabel">Size</span><br>
                <input id="size" class="round" type="text" name="is-eval"><br>
            </div>
            <div id="predicateContainer" style="display:none;">
                <span class="dbminputlabel">Predicate Function</span><br>
                <input id="predicate" class="round" type="text" name="is-eval"><br>
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
        const size = parseInt(this.evalIfPossible(data.size, cache), 10);
        const predicateFn = this.eval(`(item) => (${data.predicate || "!!item"})`, cache, true) || null;

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
                case "toArray":
                    result = sequence.toArray();
                    break;
                case "chunk":
                    result = sequence.chunk(size);
                    break;
                case "partition": {
                    const partitions = sequence.partition(predicateFn);
                    result = [partitions.false, partitions.true];
                    break;
                }
                case "unzip":
                    result = sequence.unzip();
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
