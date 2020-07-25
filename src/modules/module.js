/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Initialize attributes
const MODULE_ATTRIBUTE_ID = "id";
const MODULE_ATTRIBUTE_URL = "url";
const MODULE_ATTRIBUTE_SOURCE = "src";

// Initialize tag prefix
const MODULE_PREFIX_TAG = "module:";

// Initialize sources
const MODULE_SOURCES_LOCAL = "local";
const MODULE_SOURCES_GLOBAL = "global";
const MODULE_SOURCES_TEMPLATE = "template";

// Initialize sources object
const MODULE_SOURCES = {
    [MODULE_SOURCES_LOCAL]: "modules",
    [MODULE_SOURCES_GLOBAL]: "https://nadavtasher.github.io/Modules/src/modules",
    [MODULE_SOURCES_TEMPLATE]: "https://nadavtasher.github.io/Template/src/modules"
};

class Module {
    /**
     * Loads modules.
     * @param module Module
     */
    static load(module) {
        if (arguments.length > 1) {
            // Load all modules
            return Promise.all(Array.from(arguments).map((module) => Module.load(module)));
        } else {
            return new Promise((resolve, reject) => {
                // Create a script tag
                let scriptElement = document.createElement("script");
                // Transform name
                let moduleName = module.toLowerCase();
                // Initialize default sources
                let moduleSources = MODULE_SOURCES_LOCAL;
                // Switch sources
                for (let sources in MODULE_SOURCES) {
                    // Append to prefix
                    let prefix = sources + ":";
                    // Check prefix existence
                    if (moduleName.startsWith(prefix)) {
                        // Update module name
                        moduleName = moduleName.slice(prefix.length);
                        // Update module sources
                        moduleSources = sources;
                        // Break loop
                        break;
                    }
                }
                // Prepare the script tag
                scriptElement[MODULE_ATTRIBUTE_ID] = `${MODULE_PREFIX_TAG}${moduleName}`;
                scriptElement[MODULE_ATTRIBUTE_URL] = `${MODULE_SOURCES[moduleSources]}/${moduleName}`;
                scriptElement[MODULE_ATTRIBUTE_SOURCE] = `${scriptElement[MODULE_ATTRIBUTE_URL]}/module.js`;
                // Hook to state handlers
                scriptElement.addEventListener("load", () => {
                    // Resolve promise
                    resolve("Module was loaded");
                });
                scriptElement.addEventListener("error", () => {
                    // Remove element
                    document.head.removeChild(scriptElement);
                    // Reject promise
                    reject("Module was not loaded");
                });
                // Make sure the module isn't loaded
                if (document.getElementById(scriptElement[MODULE_ATTRIBUTE_ID]) !== null) {
                    // Resolve promise
                    resolve("Module was already loaded");
                    // Return
                    return;
                }
                // Append to head
                document.head.appendChild(scriptElement);
            });
        }
    }

    /**
     * Returns a path location for a module.
     * @param module Module
     * @param path Path
     * @returns string URL
     */
    static location(module, path = "") {
        return `${document.getElementById(MODULE_PREFIX_TAG + module.name.toLowerCase())[MODULE_ATTRIBUTE_URL]}/${path}`;
    }
}