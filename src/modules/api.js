/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/BaseTemplate/
 **/

class Module {

    // Holds the load states
    static modules = {};

    /**
     * Loads a module.
     * @param module Module
     */
    static load(module) {
        return new Promise((resolve, reject) => {
            // Make name lower-case
            module = module.toLowerCase();
            // Make sure the module isn't loaded
            if (!Module.modules.hasOwnProperty(module)) {
                // Create a script tag
                let script = document.createElement("script");
                // Prepare the script tag
                script.type = "text/javascript";
                script.src = "modules/" + module + "/module.js";
                // Hook to state handlers
                script.onload = function () {
                    resolve("Module was loaded");
                };
                script.onerror = function () {
                    reject("Module was not loaded");
                };
                // Append to modules object
                Module.modules[module] = script;
                // Append to head
                document.head.appendChild(script);
            } else {
                resolve("Module was already loaded");
            }
        });
    }
}