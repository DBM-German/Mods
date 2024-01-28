import type { DBMActionsCache } from "dbm-types/dbm-2.1";

export type * from "dbm-types/dbm-2.1";

declare module "dbm-types/dbm-2.1" {
    export interface DBM {
        Mods: DBMModsAPI;
    }

    export interface DBMModsAPI {
        /**
         * Install one or more node modules if necessary
         * @param packageSpec Package specifications (preferrably with a version or tag)
         * @throws {Error} NPM command failed
         * @example
         * mod(DBM) {
         *     DBM.Mods.install("node-fetch@3.3");
         * }
         */
        install(...packageSpec: string[]): void;

        /**
         * Check whether one or more node module are installed
         * @param packageSpec Package specifications (preferrably with a version or tag)
         * @throws {Error} NPM command failed
         */
        isInstalled<T extends string[]>(...packageSpec: T): Record<T[number], boolean>;

        /**
         * Run NPM command
         * @param command Command name (e.g. install, run, ...)
         * @param args Command arguments
         * @param opts Command options
         * @returns String or JSON
         * @throws {Error} NPM command failed
         */
        callNPM<optJSON extends boolean>(command: string, args?: readonly string[], opts?: { json?: optJSON, long?: boolean }): optJSON extends true ? any : string;

        _dependencyInfoCache: NPMDependenciesInfo | null;
    }

    export interface NPMDependenciesInfo {
        dependencies: {
            [package: string]: {
                name: string;
                description: string;
                version: string;
                resolved: string;
                overridden: boolean;
                [x: string]: any;
            }
        }
    }

    export interface DBMActionMetadata {
        dependencies?: string[];
    }
}
