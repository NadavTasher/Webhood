/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/WebTemplate/
 **/

class Module {

    // Holds the loaded modules
    static modules = {};

    /**
     * Filters a module's name.
     * @param module Module
     */
    static name(module) {
        return module.toLowerCase();
    }

    /**
     * Loads modules.
     */
    static load() {
        if (arguments.length > 1) {
            let promises = [];
            for (let module of arguments) {
                promises.push(Module.load(module));
            }
            return Promise.all(promises);
        } else {
            return new Promise((resolve, reject) => {
                // Filter the name
                let module = Module.name(arguments[0]);
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
}