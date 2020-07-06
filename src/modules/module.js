/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

const MODULE_TAG_PREFIX = "module-script-";
const MODULE_LOCAL_URL = "modules";
const MODULE_GLOBAL_URL = "https://nadavtasher.github.io/WebModules/modules";

class Module {
    /**
     * Loads a resource.
     * @param module Module
     * @param name Name
     */
    static resource(module, name) {
        return new Promise((resolve, reject) => {
            // Fetch resource directory
            let resourcesURL = document.getElementById(MODULE_TAG_PREFIX + module.toLowerCase()).resources;
            // Fetch resource
            fetch(resourcesURL + "/" + name).then(response => {
                response.text().then(contents => {
                    // Resolve
                    resolve(contents);
                }).catch(reject);
            }).catch(reject);
        });
    }

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
                let baseURL = MODULE_LOCAL_URL;
                // Decide sources
                if (moduleName.startsWith("global:")) {
                    // Shift name
                    moduleName = moduleName.slice(7);
                    // Change baseURL
                    baseURL = MODULE_GLOBAL_URL;
                }
                // Prepare the script tag
                scriptElement.id = MODULE_TAG_PREFIX + moduleName;
                scriptElement.type = "text/javascript";
                scriptElement.src = baseURL + "/" + moduleName + "/module.js";
                scriptElement.resources = baseURL + "/" + moduleName + "/resources";
                // Hook to state handlers
                scriptElement.onload = () => resolve("Module was loaded");
                scriptElement.onerror = () => reject("Module was not loaded");
                // Make sure the module isn't loaded
                for (let i = 0; i < document.scripts.length; i++) {
                    if (document.getElementById(MODULE_TAG_PREFIX + moduleName) !== null) {
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
}