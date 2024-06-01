/** @typedef {import("../types/dbm-2.1").DBMExtension} DBMExtension */

/** @type {DBMExtension} */
module.exports = {
    name: "Environment Variable Settings Provider [DBM German]",
    displayName: "Environment Variable Settings Provider",
    isEditorExtension: true,
    saveButtonText: "Save Environment Variables",

    meta: {
        version: "2.1.7",
        preciseCheck: false,
        author: "DBM German",
        authorUrl: "https://github.com/DBM-German/Mods",
        downloadUrl: "https://raw.githubusercontent.com/DBM-German/Mods/main/extensions/" + __filename.split(/[\\/]/).pop()
    },

    fields: ["enable", "token", "client", "ownerId", "slashType", "slashServers"],
    defaultFields: {
        enable: "false",
        token: "DBM_CLIENT_TOKEN",
        client: "DBM_CLIENT_ID",
        ownerId: "DBM_OWNER_ID",
        slashType: "",
        slashServers: ""
    },

    size() {
        return { width: 320, height: 450 };
    },

    html(data) {
        for (const field of this.fields.slice(1)) {
            if (data[field] == null) data[field] = this.defaultFields[field];
        }

        console.log(data);

        /**
         * Escape user content to be JS-friendly
         * @param {string} text Unescaped text
         * @returns {string} Escaped text
         */
        function escapeText(text) {
            return text.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
        }

        return `
        <div style="padding: 8px">
            <div style="width: 35%">
                <select id="enable" class="round" onchange="glob.onEnableChanged(this)">
                    <option value="true">Enable</option>
                    <option value="false" selected>Disable</option>
                </select>
            </div>
            <br>
            <div id="tokenContainer">
                <span class="dbminputlabel">Token Variable</span><br>
                <input id="token" class="round" type="text" value="${escapeText(data.token)}" placeholder="Leave empty to disable..." ${data.enable === "true" ? "" : "disabled"}><br>
            </div>
            <br>
            <div id="clientContainer">
                <span class="dbminputlabel">Client ID Variable</span><br>
                <input id="client" class="round" type="text" value="${escapeText(data.client)}" placeholder="Leave empty to disable..." ${data.enable === "true" ? "" : "disabled"}><br>
            </div>
            <br>
            <div id="ownerContainer">
                <span class="dbminputlabel">Owner ID Variable</span><br>
                <input id="ownerId" class="round" type="text" value="${escapeText(data.ownerId)}" placeholder="Leave empty to disable..." ${data.enable === "true" ? "" : "disabled"}><br>
            </div>
            <br>
            <div id="slashTypeContainer">
                <span class="dbminputlabel">Slash Command Creation Type Variable</span><br>
                <input id="slashType" class="round" type="text" value="${escapeText(data.slashType)}" placeholder="Leave empty to disable..." ${data.enable === "true" ? "" : "disabled"}><br>
            </div>
            <br>
            <div id="slashServersContainer">
                <span class="dbminputlabel">Slash Command Servers Variable</span><br>
                <input id="slashServers" class="round" type="text" value="${escapeText(data.slashServers)}" placeholder="Leave empty to disable..." ${data.enable === "true" ? "" : "disabled"}><br>
            </div>
            <br>
        </div>
        `;
    },

    init(document, globalObject) {
        const { glob } = globalObject;
        const inputContainers = ["tokenContainer", "clientContainer", "ownerContainer", "slashTypeContainer", "slashServersContainer"];
        const inputElements = ["button", "fieldset", "optgroup", "select", "textarea", "input"];

        glob.onEnableChanged = function(event) {
            let selector = "";

            for (const inputContainer of inputContainers) {
                for (const inputElement of inputElements) {
                    if (selector.length > 0) selector += ", ";
                    selector += `#${inputContainer} ${inputElement}`;
                }
            }
            /** @type {NodeListOf<HTMLInputElement>} */
            const elements = document.querySelectorAll(selector);

            for (const element of elements) {
                if (event.value === "true") {
                    element.disabled = false;
                    element.classList.remove("disabledClass");
                } else {
                    element.disabled = true;
                    element.classList.add("disabledClass");
                }
            }
        };

        glob.onEnableChanged(document.getElementById("enable"));
    },

    close(_document, _data, _globalObject) {
    },

    mod(DBM) {
        const name = this.name;
        const envVars = this.fields.slice(1).filter(envVar => envVar.length > 0);

        const _init = DBM.Bot.init;
        DBM.Bot.init = function() {
            const settings = DBM.Files?.data.settings;
            /** @type {import("../types/dbm-2.1").DBMExtensionJSON} */
            const data = settings?.[name];

            if (data.enable) {
                for (const envVar of envVars) {
                    settings[envVar] = process.env[envVar];
                }
            }

            _init.call(DBM.Bot);
        };
    }
};
