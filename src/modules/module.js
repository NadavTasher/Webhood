/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/WebTemplate/
 **/

class Module {

    /**
     * Filters a module's name.
     * @param module Module
     */
    static name(module) {
        return module.toLowerCase();
    }

    /**
     * Loads modules.
     * @param module Module
     */
    static load(module) {
        if (arguments.length > 1) {
            let promises = [];
            for (let module of arguments) {
                promises.push(Module.load(module));
            }
            return Promise.all(promises);
        } else {
            return new Promise((resolve, reject) => {
                // Filter the name
                module = Module.name(module);
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
                // Make sure the module isn't loaded
                for (let i = 0; i < document.scripts.length; i++) {
                    if (document.scripts[i].outerHTML === script.outerHTML) {
                        resolve("Module was already loaded");
                        // Return
                        return;
                    }
                }
                // Append to head
                document.head.appendChild(script);
            });
        }
    }
}