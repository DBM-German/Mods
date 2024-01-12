/** @typedef {import("dbm-types/dbm-2.1").DBMAction} DBMAction */

/** @type {DBMAction} */
module.exports = {
    name: "Comment [DBM German]",
    displayName: "Comment",
    section: "Other Stuff",

    subtitle(data, _presets) {
        return `
<span style="color: ${data.color}; font-weight: ${data.bold ? "bold" : "normal"}; font-style: ${data.italic ? "italic" : "normal"}; text-decoration: ${data.underline ? "underline" : "none"}">
    ${data.shortComment}
</span>`;
    },

    meta: { version: "2.1.7", preciseCheck: false, author: "DBM German", authorUrl: "https://github.com/DBM-German/Mods", downloadUrl: "https://raw.githubusercontent.com/dbm-german/Mods/main/actions/comment.mod.js" },

    fields: [ "shortComment", "longComment", "color", "bold", "italic", "underline" ],

    html(_isEvent, _data) {
        return `
<style>
.item-container {
    display: flex;
    justify-content: flex-start;
    gap: 30px;
}
.pretty {
    margin: 0 auto !important;
}
.color-picker {
    width: 28px !important;
    margin: 0 auto !important;
    padding-left: 2px !important;
    padding-right: 2px !important;
    padding-bottom: 0px !important;
    cursor: pointer;
}
</style>

<div>
    <div class="item-container" style="padding-top: 8px">
        <div style="flex: 1 100%">
            <label for="shortComment" class="dbminputlabel">Short Comment</label><br>
            <input id="shortComment" class="round" type="text" placeholder="Insert short comment here..." maxlength="80"><br>
        </div>
        <div style="flex: 1 auto">
            <label for="color" class="dbminputlabel">Color</label><br>
            <input id="color" class="round color-picker" type="color" value="#cccccc"><br>
        </div>
    </div>
    <div class="item-container" style="padding-top: 8px">
        <div>
            <dbm-checkbox id="bold" label="Bold"></dbm-checkbox><br>
        </div>
        <div>
            <dbm-checkbox id="italic" label="Italic"></dbm-checkbox><br>
        </div>
        <div>
            <dbm-checkbox id="underline" label="Underline"></dbm-checkbox><br>
        </div>
    </div>
    <div style="padding-top: 8px">
        <label for="longComment" class="dbminputlabel">Long Comment</label><br>
        <textarea id="longComment" rows="8" placeholder="Insert optional long comment here..." resize: none;"></textarea>
    </div>
</div>
`;
    },

    init() {
    },

    action(cache) {
        this.callNextAction(cache);
    }
};
