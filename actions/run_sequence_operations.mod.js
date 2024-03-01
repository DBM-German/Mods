/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */
/** @typedef {import("../types/dbm-2.1").DBMVarType} DBMVarType */

const OPERATIONS = {
    distinct: "Distinct",
    distinctBy: "Distinct By",
    distinctByData: "Distinct By Data",
    drop: "Drop",
    dropWhile: "Drop While",
    filter: "Filter",
    filterIndexed: "Filter Indexed",
    filterNot: "Filter Not",
    filterNotNull: "Filter Not Null",
    flatMap: "Flat Map",
    flatten: "Flatten",
    map: "Map",
    mapIndexed: "Map Indexed",
    mapNotNull: "Map Not Null",
    mapToData: "Map to Data",
    merge: "Merge",
    mergeBy: "Merge By",
    mergeByData: "Merge By Data",
    minus: "Minus",
    onEach: "On Each",
    plus: "Plus",
    reverse: "Reverse",
    sorted: "Sorted",
    sortedDescending: "Sorted Descending",
    sortedBy: "Sorted By",
    sortedByDescending: "Sorted By Descending",
    sortedByData: "Sorted By Data",
    sortedByDataDescending: "Sorted By Data Descending",
    sortedWith: "Sorted With",
    take: "Take",
    takeWhile: "Take While",
    withIndex: "With Index",
    zip: "Zip"
};

const OPERATION_FIELD_CONTAINERS = [
    "valueContainer",
    "numberContainer",
    "selectorContainer",
    "dataSelectorContainer",
    "predicateContainer",
    "transformContainer",
    "comparisonContainer",
    "prependNewValuesContainer",
    "tempVarContainer",
    "callTypeContainer",
    "actionsContainer"
];

/** @type {Record<keyof typeof OPERATIONS, string[]> }} */
const OPERATION_FIELD_CONTAINER_MAPPINGS = {
    distinct: [],
    distinctBy: ["selectorContainer"],
    distinctByData: ["dataSelectorContainer"],
    drop: ["numberContainer"],
    dropWhile: ["predicateContainer"],
    filter: ["predicateContainer"],
    filterIndexed: ["predicateContainer"],
    filterNot: ["predicateContainer"],
    filterNotNull: [],
    flatMap: ["transformContainer"],
    flatten: [],
    map: ["transformContainer"],
    mapIndexed: ["transformContainer"],
    mapNotNull: ["transformContainer"],
    mapToData: ["dataSelectorContainer"],
    merge: ["valueContainer", "prependNewValuesContainer"],
    mergeBy: ["valueContainer", "selectorContainer", "prependNewValuesContainer"],
    mergeByData: ["valueContainer", "dataSelectorContainer", "prependNewValuesContainer"],
    minus: ["valueContainer"],
    onEach: ["tempVarContainer", "callTypeContainer", "actionsContainer"],
    plus: ["valueContainer", "prependNewValuesContainer"],
    reverse: [],
    sorted: [],
    sortedDescending: [],
    sortedBy: ["selectorContainer"],
    sortedByDescending: ["selectorContainer"],
    sortedByData: ["dataSelectorContainer"],
    sortedByDataDescending: ["dataSelectorContainer"],
    sortedWith: ["comparisonContainer"],
    take: ["numberContainer"],
    takeWhile: ["predicateContainer"],
    withIndex: [],
    zip: ["valueContainer"]
};

/** @type {Record<keyof typeof OPERATIONS, string> }} */
const OPERATION_HELP_TEXTS = {
    distinct: `
    Discards all duplicate items.
    `,
    distinctBy: `
    Discards all items with duplicate results determined by the given <span class="help_highlightText">Selector Function</span>.
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
    distinctByData: `
    Discards all items with duplicate values associated to the given <span class="help_highlightText">Data Name</span>.
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
    drop: `
    Discards the specified <span class="help_highlightText">Number</span> of items.
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
                    <td>Number</td>
                    <td>1..n</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    dropWhile: `
    Drops all items as long as the given <span class="help_highlightText">Predicate Function</span> evaluates to <span class="help_highlightText">true</span>.
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
    filter: `
    Keeps only items that match the given <span class="help_highlightText">Predicate Function</span>.
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
    filterIndexed: `
    Keeps only items that match the given <span class="help_highlightText">Predicate Function</span>.
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
                            <li>index</li>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Boolean</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    filterNot: `
    Keeps only items that don't match the given <span class="help_highlightText">Predicate Function</span>.
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
    filterNotNull: `
    Keeps only non-null items (neither <span class="help_highlightText">null</span> nor <span class="help_highlightText">undefined</span>).
    `,
    flatMap: `
    Transforms each item into a new sequence of items and combines them to a single flat sequence consisting of those items.
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
                    <td>Transform Function</td>
                    <td>
                        <ul>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Sequence</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    flatten: `
    Transforms items that are sequences or iterables to a single flat sequence of all those items while keeping the other items as they are.
    `,
    map: `
    Transforms each item into another value by applying the given <span class="help_highlightText">Transform Function</span>.
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
                    <td>Transform Function</td>
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
    mapIndexed: `
    Transforms each item into another value by applying the given <span class="help_highlightText">Transform Function</span>.
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
                    <td>Transform Function</td>
                    <td>
                        <ul>
                            <li>index</li>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Anything</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    mapNotNull: `
    Transforms each item into another value by applying the given <span class="help_highlightText">Transform Function</span>.
    Transformations into null values (either <span class="help_highlightText">null</span> or <span class="help_highlightText">undefined</span>) are discarded.
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
                    <td>Transform Function</td>
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
    mapToData: `
    Transforms each item into another value associated to the given <span class="help_highlightText">Data Name</span>.
    Transformations into null values (either <span class="help_highlightText">null</span> or <span class="help_highlightText">undefined</span>) are discarded.
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
    merge: `
    Merges the items of two sequences into a new sequence.
    Each item of the current sequence is eventually replaced with an item of the other sequence by comparing them to each other.
    If no value is found in the other sequence the item is retained. New items of the other sequence are appended to the end of the new sequence or prepended to the start of the new sequence,
    if <span class="help_highlightText">Prepend New Values</span> is enabled.<br>
    <strong>This operation is not lazily evaluated, meaning that all input data gets examined immediately once the operation is invoked!</strong>
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
                    <td>Value</td>
                    <td>Sequence / Iterable</td>
                </tr>
                <tr>
                    <td>Prepend New Values</td>
                    <td>n/a</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    mergeBy: `
    Merges the items of two sequences into a new sequence.
    Each item of the current sequence is eventually replaced with an item of the other sequence by comparing the results of the given <span class="help_highlightText">Selector Function</span>.
    If no value is found in the other sequence the item is retained. New items of the other sequence are appended to the end of the new sequence or prepended to the start of the new sequence,
    if <span class="help_highlightText">Prepend New Values</span> is enabled.<br>
    <strong>This operation is not lazily evaluated, meaning that all input data gets examined immediately once the operation is invoked!</strong>
    <br><br>
    <b>Options</b>
    <div class="help_textContainer">
        <table class="options-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Name</th>
                    <th>Data Type</th>
                    <th>Parameters</th>
                    <th>Return Type</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Value</td>
                    <td>Sequence / Iterable</td>
                    <td>n/a</td>
                    <td>n/a</td>
                </tr>
                <tr>
                    <td>Selector Function</td>
                    <td>n/a</td>
                    <td>
                        <ul>
                            <li>item</li>
                        </ul>
                    </td>
                    <td>Anything</td>
                </tr>
                <tr>
                    <td>Prepend New Values</td>
                    <td>n/a</td>
                    <td>n/a</td>
                    <td>n/a</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    mergeByData: `
    Merges the items of two sequences into a new sequence.
    Each item of the current sequence is eventually replaced with an item of the other sequence by comparing the values associated to the given <span class="help_highlightText">Data Name</span>.
    If no value is found in the other sequence the item is retained. New items of the other sequence are appended to the end of the new sequence or prepended to the start of the new sequence,
    if <span class="help_highlightText">Prepend New Values</span> is enabled.<br>
    <strong>This operation is not lazily evaluated, meaning that all input data gets examined immediately once the operation is invoked!</strong>
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
                    <td>Value</td>
                    <td>Sequence / Iterable</td>
                </tr>
                <tr>
                    <td>Data Name</td>
                    <td>Text</td>
                </tr>
                <tr>
                    <td>Default Value</td>
                    <td>Anything</td>
                </tr>
                <tr>
                    <td>Prepend New Values</td>
                    <td>n/a</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    minus: `
    Removes the given data which can either be a single item, a list (array) of items or another sequence.
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
                    <td>Value</td>
                    <td>Sequence / Anything</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    onEach: `
    Performs the given actions for each item without actively changing them.<br>
    <strong>This operation is either lazily evaluated (Call Type "Run Simultaneously") or immediately once the operation is started (Call Type "Wait for Completion"),
    meaning that all input data gets examined immediately once the operation is invoked!</strong>
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
                    <td>Temp Var. Name</td>
                    <td>Text</td>
                </tr>
                <tr>
                    <td>Call Type</td>
                    <td>n/a</td>
                </tr>
                <tr>
                    <td>Actions</td>
                    <td>n/a</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    plus: `
    Adds the given data which can either be a single item, a list (array) of items or another sequence.
    Data gets appended to the end of the sequence or prepended to the start, if <span class="help_highlightText">Prepend New Values</span> is enabled.<br>
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
                    <td>Value</td>
                    <td>Sequence / List / Anything</td>
                </tr>
                <tr>
                    <td>Prepend New Values</td>
                    <td>n/a</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    reverse: `
    Reverses the order of the items in the sequence.
    `,
    sorted: `
    Sorts the items in the sequence in natural (ascending) order.
    `,
    sortedDescending: `
    Sorts the items in the sequence in reverse (descending) order.
    `,
    sortedBy: `
    Sorts the items in the sequence in natural (ascending) order by the result of the given <span class="help_highlightText">Selector Function</span>.
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
    sortedByDescending: `
    Sorts the items in the sequence in reverse (descending) order by the result of the given <span class="help_highlightText">Selector Function</span>.
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
    sortedByData: `
    Sorts the items in the sequence in natural (ascending) order by the value associated to the given <span class="help_highlightText">Data Name</span>.
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
    sortedByDataDescending: `
    Sorts the items in the sequence in reverse (descending) order by the value associated to the given <span class="help_highlightText">Data Name</span>.
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
    sortedWith: `
    Sorts the items in the sequence by the result of the given <span class="help_highlightText">Comparison Functions</span>.
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
    take: `
    Keeps only the specified <span class="help_highlightText">Number</span> of items. All other items are discarded.
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
                    <td>Number</td>
                    <td>1..n</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    takeWhile: `
    Keeps items only until the given <span class="help_highlightText">Predicate Function</span> evaluates to <span class="help_highlightText">true</span>.
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
    withIndex: `
    Transforms each item into another value which consists of the current index in the sequence and the original item as its own value (<span class="help_highlightText">{ index: number, value: any }</span>).
    `,
    zip: `
    Merges the items of two sequences into a new sequence. Each item of the current sequence is eventually linked with an item of the other sequence at the same index (pair structure: <span class="help_highlightText">[ item1, item2 ]</span>).
    The resulting sequence has the length of the shortest input sequence. All other items are discarded.
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
                    <td>Value</td>
                    <td>Sequence</td>
                </tr>
            </tbody>
        </table>
    </div>
    `
};

/** @type {DBMAction} */
module.exports = {
    name: "Run Sequence Operations [DBM German]",
    displayName: "Run Sequence Operations",
    section: "Sequences",

    subtitle(data, presets) {
        return `Run ${Object.keys(data.operations).length} Operations on ${presets.getVariableText(data.storage, data.varName)}`;
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop(),
        dependencies: ["sequency@0.20"]
    },

    fields: ["storage", "varName", "operations"],

    html(_isEvent, _data) {
        return `
        <retrieve-from-variable dropdownLabel="Source Sequence" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

        <br><br><br><br>

        <dialog-list id="operations" fields='["type", "value", "number", "selector", "dataName", "dataDefaultVal", "predicate", "transform", "comparison", "prependNewValues", "tempVarName", "callType", "actions"]' dialogResizable dialogTitle="Sequence Operation" dialogWidth="560" dialogHeight="540" listLabel="Sequence Operations" listStyle="height: calc(100vh - 290px);" itemName="Operation" itemHeight="28px;" itemTextFunction="glob.formatOperation(data)" itemStyle="line-height: 28px;">
            <div style="padding: 16px;">
                <div style="width: 45%;">
                    <span class="dbminputlabel">
                        <span>Operation</span>
                        <help-icon dialogTitle="Intermediate Operations Help" dialogWidth="600" dialogHeight="600" type="0">
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
                    <!-- Use autofocus to trigger initialization because "onchange" only triggers for changes made by the user -->
                    <select id="type" class="round" autofocus onfocus='if (!glob.onOperationChange) require(glob.actLoc + "/" + glob.actions["Run Sequence Operations [DBM German]"]).init.call(window)' onchange='glob.onOperationChange(this)'>
                        ${Object.entries(OPERATIONS).map(op => `<option value="${op[0]}">${op[1]}</option>`).join("\n")}
                    </select>
                    <br>
                </div>
                <div id="valueContainer" style="display:none;">
                    <span class="dbminputlabel">Value</span><br>
                    <input id="value" class="round" type="text" name="is-eval"><br>
                </div>
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
                <div id="transformContainer" style="display:none;">
                    <span class="dbminputlabel">Transform Function</span><br>
                    <input id="transform" class="round" type="text" name="is-eval"><br>
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
                <div id="prependNewValuesContainer" style="display:none;">
                    <span class="dbminputlabel">Prepend New Values</span><br>
                    <select id="prependNewValues" class="round">
                        <option value="true">Yes</option>
                        <option value="false" selected>No</option>
                    </select>
                    <br>
                </div>
                <div id="tempVarContainer" style="display:none;">
                    <span class="dbminputlabel">Temp Variable Name</span><br>
                    <input id="tempVarName" class="round" type="text" placeholder="Stores the current item for actions..."><br>
                </div>
                <div id="callTypeContainer" style="display:none;">
                    <span class="dbminputlabel">Call Type</span><br>
                    <select id="callType" class="round">
                        <option value="0" selected>Wait for Completion</option>
                        <option value="1">Run Simultaneously</option>
                    </select>
                    <br>
                </div>
                <div id="actionsContainer" style="display:none;">
                    <action-list-input id="actions" actionListLabel="Actions" height="calc(100vh - 340px)">
                        <script class="setupTempVars">
                            const element = document.getElementById("tempVarName");
                            if (element?.value && element?.style.display !== "none") {
                                tempVars.push([element.value, "Unknown Type"]);
                            }
                        </script>
                    </action-list-input>
                </div>
            </div>
        </dialog-list>
        `;
    },

    init() {
        const { glob, document } = this;
        const operationSelect = /** @type {HTMLSelectElement} */ (document.querySelector("select[id=\"type\"]"));

        glob.formatOperation = function(operation) {
            /** @type {keyof typeof OPERATIONS} */
            const type = operation.type;
            let details;

            const formatPrependNewValues = (value) => `${value === "true" ? "prepend" : "append"} new values`;
            const formatDefaultValue = (value) => value?.length > 0 ? `default: ${value}` : "no default value";
            const formatCallType = (value) => value === "0" ? "synchronously" : "asynchronously";

            switch (type) {
                case "distinct":
                case "filterNotNull":
                case "flatten":
                case "reverse":
                case "sorted":
                case "sortedDescending":
                case "withIndex":
                    details = "";
                    break;
                case "minus":
                case "zip":
                    details = operation.value;
                    break;
                case "plus":
                    details = `${operation.value} (${formatPrependNewValues(operation.prependNewValues)})`;
                    break;
                case "drop":
                case "take":
                    details = operation.number;
                    break;
                case "distinctBy":
                case "sortedBy":
                case "sortedByDescending":
                    details = `(item) => (${operation.selector || "item"})`;
                    break;
                case "distinctByData":
                case "mapToData":
                case "sortedByData":
                case "sortedByDataDescending":
                    details = `${operation.dataName} (${formatDefaultValue(operation.dataDefaultVal)})`;
                    break;
                case "dropWhile":
                case "filter":
                case "filterNot":
                case "takeWhile":
                    details = `(item) => (${operation.predicate || "!!item"})`;
                    break;
                case "filterIndexed":
                    details = `(index, item) => (${operation.predicate || "!!item"})`;
                    break;
                case "flatMap":
                case "map":
                case "mapNotNull":
                    details = `(item) => (${operation.transform || "item"})`;
                    break;
                case "mapIndexed":
                    details = `(index, item) => (${operation.transform || "item"})`;
                    break;
                case "merge":
                    details = `${operation.value} (${formatPrependNewValues(operation.prependNewValues)})`;
                    break;
                case "mergeBy":
                    details = `${operation.value} with ${operation.selector} (${formatPrependNewValues(operation.prependNewValues)})`;
                    break;
                case "mergeByData":
                    details `${operation.value} with ${operation.dataName} (${formatDefaultValue(operation.dataDefaultVal)}; ${formatPrependNewValues(operation.prependNewValues)})`;
                    break;
                case "onEach":
                    details = `Call ${operation.actions.length} Action${operation.actions.length === 1 ? "" : "s"} (${formatCallType(operation.callType)})`;
                    break;
                case "sortedWith":
                    details = `(a, b) => (${operation.comparison})`;
                    break;
            }

            return `
            <div style="display: inline-block; width: 200px; padding-left: 8px;">${OPERATIONS[operation.type]}</div>
            <span>${details}</span>
            `;
        };

        // Additional initialization within Sequence Operation dialog
        if (!operationSelect) return;

        // Remove autofocus used to trigger initialization
        document.activeElement?.["blur"]?.();

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

    async action(cache) {
        const data = cache.actions[cache.index];
        const { asSequence, emptySequence } = require("sequency");

        const storage = /** @type {DBMVarType} */ (parseInt(data.storage, 10));
        const varName = this.evalMessage(data.varName, cache);
        /** @type {import("sequency").default} */
        let sequence = this.getVariable(storage, varName, cache);

        for (let i = 0; i < data.operations.length; i++) {
            const operation = data.operations[i];
            /** @type {keyof typeof OPERATIONS} */
            const type = operation.type;
            const value = this.evalIfPossible(operation.value, cache);
            const number = parseInt(this.evalIfPossible(operation.number, cache), 10);
            const selectorFn = this.eval(`(item) => (${operation.selector || "item"})`, cache, true) || null;
            const dataName = this.evalMessage(operation.dataName, cache);
            const dataDefaultVal = this.evalIfPossible(operation.dataDefaultVal, cache);
            const predicateFn = this.eval(`(item) => (${operation.predicate || "!!item"})`, cache, true) || null;
            const predicateWithIndexFn = this.eval(`(index, item) => (${operation.predicate || "!!item"})`, cache, true) || null;
            const transformFn = this.eval(`(item) => (${operation.transform || "item"})`, cache, true) || null;
            const transformWithIndexFn = this.eval(`(index, item) => (${operation.transform || "item"})`, cache, true) || null;
            const prependNewValues = operation.prependNewValues === "true";
            const comparisonFn = this.eval(`(a, b) => (${operation.comparison})`, cache, true) || null;
            const tempVarName = this.evalMessage(operation.tempVarName, cache);
            const callType = parseInt(data.callType, 10);
            const subActions = operation.actions;

            try {
                switch (type) {
                    case "distinct":
                        sequence = sequence.distinct();
                        break;
                    case "distinctBy":
                        sequence = sequence.distinctBy(selectorFn);
                        break;
                    case "distinctByData":
                        sequence = sequence.distinctBy(item => item?.data?.(dataName, dataDefaultVal));
                        break;
                    case "drop":
                        sequence = sequence.drop(number);
                        break;
                    case "dropWhile":
                        sequence = sequence.dropWhile(predicateFn);
                        break;
                    case "filter":
                        sequence = sequence.filter(predicateFn);
                        break;
                    case "filterIndexed":
                        sequence = sequence.filterIndexed(predicateWithIndexFn);
                        break;
                    case "filterNot":
                        sequence = sequence.filterNot(predicateFn);
                        break;
                    case "filterNotNull":
                        sequence = sequence.filterNotNull();
                        break;
                    case "flatMap":
                        sequence = sequence.flatMap(transformFn);
                        break;
                    case "flatten":
                        sequence = sequence.flatten();
                        break;
                    case "map":
                        sequence = sequence.map(transformFn);
                        break;
                    case "mapIndexed":
                        sequence = sequence.mapIndexed(transformWithIndexFn);
                        break;
                    case "mapNotNull":
                        sequence = sequence.mapNotNull(transformFn);
                        break;
                    case "mapToData":
                        sequence = sequence.map(item => item?.data?.(dataName, dataDefaultVal));
                        break;
                    case "merge":
                        sequence = sequence.merge(value, item => item, prependNewValues);
                        break;
                    case "mergeBy":
                        sequence = sequence.merge(value, selectorFn, prependNewValues);
                        break;
                    case "mergeByData":
                        sequence = sequence.merge(value, item => item?.data?.(dataName, dataDefaultVal));
                        break;
                    case "minus":
                        sequence = sequence.minus(value);
                        break;
                    case "onEach": {
                        if (callType === 0) {
                            // Wait for Completion
                            const oldSequence = sequence;
                            sequence = emptySequence();

                            for (const item of oldSequence.asIterable()) {
                                sequence = sequence.plus(item);

                                await new Promise((resolve, reject) => {
                                    try {
                                        this.storeValue(item, 1, tempVarName, cache);
                                        this.executeSubActions(subActions, cache, resolve);
                                    } catch (error) {
                                        // Append remaining items to new sequence before re-throwing error so that the next operation has the full sequence again
                                        sequence = sequence.plus(oldSequence);
                                        reject(error);
                                    }
                                });
                            }
                        } else {
                            // Run Simultaneously
                            sequence = sequence.onEach(item => {
                                this.storeValue(item, 1, tempVarName, cache);
                                this.executeSubActions(subActions, cache);
                            });
                        }
                        break;
                    }
                    case "plus":
                        sequence = prependNewValues ? asSequence([value]).plus(sequence) : sequence.plus(value);
                        break;
                    case "reverse":
                        sequence = sequence.reverse();
                        break;
                    case "sorted":
                        sequence = sequence.sorted();
                        break;
                    case "sortedDescending":
                        sequence = sequence.sortedDescending();
                        break;
                    case "sortedBy":
                        sequence = sequence.sortedBy(selectorFn);
                        break;
                    case "sortedByDescending":
                        sequence = sequence.sortedByDescending(selectorFn);
                        break;
                    case "sortedByData":
                        sequence = sequence.sortedBy(item => item?.data?.(dataName, dataDefaultVal));
                        break;
                    case "sortedByDataDescending":
                        sequence = sequence.sortedByDescending(item => item?.data?.(dataName, dataDefaultVal));
                        break;
                    case "sortedWith":
                        sequence = sequence.sortedWith(comparisonFn);
                        break;
                    case "take":
                        sequence = sequence.take(number);
                        break;
                    case "takeWhile":
                        sequence = sequence.takeWhile(predicateFn);
                        break;
                    case "withIndex":
                        sequence = sequence.withIndex();
                        break;
                    case "zip":
                        sequence = sequence.zip(value);
                        break;
                }
            } catch (error) {
                this.displayError(data, cache, error);
            }
        }

        this.storeValue(sequence, storage, varName, cache);
        this.callNextAction(cache);
    },

    modInit(data) {
        for (const operation of data.operations) {
            if (operation.type === "onEach") this.prepareActions(operation.actions);
        }
    }
};
