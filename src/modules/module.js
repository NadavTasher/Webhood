/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

const MODULE_PREFIX_TAG = "module:";
const MODULE_PREFIX_GLOBAL = "global:";

const MODULE_ATTRIBUTE_ID = "id";
const MODULE_ATTRIBUTE_TYPE = "type";
const MODULE_ATTRIBUTE_SOURCE = "src";
const MODULE_ATTRIBUTE_RESOURCES = "resources";

const MODULE_URL_LOCAL = "modules";
const MODULE_URL_GLOBAL = "https://nadavtasher.github.io/Modules";

class Module {
    /**
     * Loads modules.
     * @param module Module
     */
    static load(module) {
        if (arguments.length > 1) {
            return Promise.all(Array.from(arguments).map((module) => Module.load(module)));
        } else {
            return new Promise((resolve, reject) => {
                // Create a script tag
                let scriptElement = document.createElement("script");
                // Transform name
                let moduleName = module.toLowerCase();
                // Initialize URL
                let baseURL = MODULE_URL_LOCAL;
                // Decide sources
                if (moduleName.startsWith(MODULE_PREFIX_GLOBAL)) {
                    // Shift name
                    moduleName = moduleName.slice(MODULE_PREFIX_GLOBAL.length);
                    // Change baseURL
                    baseURL = MODULE_URL_GLOBAL;
                }
                // Prepare the script tag
                scriptElement.setAttribute(MODULE_ATTRIBUTE_TYPE, "text/javascript");
                scriptElement.setAttribute(MODULE_ATTRIBUTE_ID, MODULE_PREFIX_TAG + moduleName);
                scriptElement.setAttribute(MODULE_ATTRIBUTE_SOURCE, baseURL + "/" + moduleName + "/module.js");
                scriptElement.setAttribute(MODULE_ATTRIBUTE_RESOURCES, baseURL + "/" + moduleName + "/resources");
                // Hook to state handlers
                scriptElement.onload = () => resolve("Module was loaded");
                scriptElement.onerror = () => reject("Module was not loaded");
                // Make sure the module isn't loaded
                for (let i = 0; i < document.scripts.length; i++) {
                    if (document.getElementById(MODULE_PREFIX_TAG + moduleName) !== null) {
                        resolve("Module was already loaded");
                        // Return
                        return;
                    }
                }
                // Append to head
                document.head.appendChild(scriptElement);
            });
        }
    }

    /**
     * Loads a resource.
     * @param module Module
     * @param name Name
     */
    static resource(module, name) {
        return new Promise((resolve, reject) => {
            // Fetch resource directory
            let resourcesURL = document.getElementById(MODULE_PREFIX_TAG + module.toLowerCase()).getAttribute(MODULE_ATTRIBUTE_RESOURCES);
            // Fetch resource
            fetch(resourcesURL + "/" + name).then(response => {
                response.text().then(contents => {
                    // Resolve
                    resolve(contents);
                }).catch(reject);
            }).catch(reject);
        });
    }
}