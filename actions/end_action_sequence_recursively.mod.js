/** @typedef {import("../types/dbm-2.1").DBMAction} DBMAction */

/** @type {DBMAction} */
module.exports = {
    name: "End Action Sequence Recursively [DBM German]",
    displayName: "End Action Sequence Recursively",
    section: "Other Stuff",

    subtitle(_data, _presets) {
        return "";
    },

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/actions/" + __filename.split(/[\\/]/).pop()
    },

    fields: [],

    html(_isEvent, _data) {
        return `
        The regular End Action Sequence action just ends the current sequence and not parent sequences. When using it in sub-sequences (like with the Action Container action) the parent sequence continues its execution.<br>
        Whereas this action ends the entire sequence recursively, meaning that parent sequences do not continue.<br>
        `;
    },

    init() {
    },

    action(_cache) {
        // Neither call `this.callNextAction(cache)` nor `this.endActions(cache)` to prevent callback execution
    }
};
