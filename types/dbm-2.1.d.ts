import type { DBMAction, DBMActionsCache, DBMExtensionJSON, DBMSettingsJSON, DBMVarType } from "dbm-types/dbm-2.1";

export type * from "dbm-types/dbm-2.1";

declare module "dbm-types/dbm-2.1" {
    export interface DBM {
        Mods: DBMModsAPI;
    }

    export interface NPMDependenciesInfo {
        dependencies: {
            [package: string]: {
                name: string;
                description?: string;
                version: string;
                resolved?: string;
                overridden?: boolean;
                [x: string]: any;
            };
        };
    }

    export interface DBMActionMetadata {
        dependencies?: string[];
    }

    export interface DBMModsAPISettingsJSON extends DBMExtensionJSON {
        enableNodePath: string;
        nodePath: string;
        enableNpmPath: string;
        npmPath: string;
    }

    export interface DBMEnvSettingsProviderExtensionJSON extends DBMExtensionJSON {
        enable: `true` | `false` | string & {};
        token: string;
        client: string;
        ownerId: string;
        slashType: string;
        slashServers: string;
    }

    export interface DBMModsAPIHelpers {
        /**
         * Get the current working directory
         * @returns Current working directory
         */
        cwd(): Promise<string>;

        /**
         * Get the project settings
         * @returns Project settings
         */
        getSettings(): Promise<DBMSettingsJSON>;

        /**
         * Get the mods API settings
         * @returns Mods API settings
         */
        getAPISettings(): Promise<DBMModsAPISettingsJSON | undefined>;

        /**
         * Get NPM dependencies info
         * @returns Dependencies info
         */
        getDependenciesInfo(): Promise<NPMDependenciesInfo>;

        /**
         * (Re-)Install one or more node modules
         * @param packageSpecs Package specifications (preferrably with a version or tag)
         * @throws {Error} NPM command failed
         * @example
         * await helpers.install("node-fetch@3.3"); // Always attempts to install the package
         */
        install(packageSpecs: string[]): Promise<void>;

        /**
         * Run NPM command
         * @param command Command name (e.g. install, run, ...)
         * @param args Command arguments
         * @param opts Command options
         * @returns String or JSON
         * @throws {Error} NPM command failed
         */
        callNPM<optJSON extends boolean>(command: string, args?: readonly string[], opts?: { json?: optJSON, long?: boolean }): Promise<optJSON extends true ? any : string>;
    }

    export interface DBMSharedModsAPI {
        /**
         * Get the current working directory
         * @returns Current working directory
         */
        cwd(): Promise<string>;

        /**
         * Get the project settings
         * @returns Project settings
         */
        getSettings(): Promise<DBMSettingsJSON>;

        /**
         * Get the mods API settings
         * @returns Mods API settings
         */
        getAPISettings(): Promise<DBMModsAPISettingsJSON | undefined>;

        /**
         * Install one or more node modules if necessary
         * @param packageSpecs Package specifications (preferrably with a version or tag)
         * @throws {Error} NPM command failed
         * @example
         * await DBM.Mods.install("node-fetch@3.3"); // Only attempts to install the package if it is not already installed
         */
        install(...packageSpecs: string[]): Promise<void>;

        /**
         * Check whether one or more node module are installed
         * @param packageSpec Package specifications (preferrably with a version or tag)
         * @throws {Error} NPM command failed
         */
        isInstalled<T extends string[]>(...packageSpec: T): Promise<Record<T[number], boolean>>;

        _dependencyInfoCache: NPMDependenciesInfo | null;
    }

    export interface DBMModsAPI extends DBMSharedModsAPI {
        /**
         * Eval function with additional features
         * @param content Code to evaluate
         * @param cache DBM actions cache
         * @param options Options
         * @returns Evaluation result
         */
        eval(content: string, cache: DBMActionsCache, options?: { logError?: boolean, customVariables?: { [name: string]: { value: unknown, type: "variable" | "constant" } } }): any;

        /**
         * Check if the input is an array
         * @param input User input
         * @param data DBM action JSON
         * @param cache DBM actions cache
         */
        assertArrayInput<T = any>(input: unknown, storage: DBMVarType, varName: string): asserts input is T[];

        _varTypes: Record<DBMVarType, string>;
    }

    export interface DBMEditorModsAPI extends DBMSharedModsAPI {
    }

    export interface DBMModsAPIAction extends DBMAction {
        /**
         * Create shared mods API
         * @param helpers Helper methods for the mods API
         * @returns Shared mods API
         */
        getSharedAPI(helpers: DBMModsAPIHelpers): DBMSharedModsAPI;

        /**
         * Create mods API for the DBM bot
         * @param DBM DBM interface
         * @returns Mods API
         */
        getBotAPI(DBM: DBM): DBMModsAPI;

        /**
         * Create mods API for the DBM editor
         * @param window DBM editor shared window
         * @returns Editor mods API
         */
        getEditorAPI(window: Window): DBMEditorModsAPI;
    }
}
