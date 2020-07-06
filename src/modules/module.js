/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/WebTemplate/
 **/

class Module {
    /**
     * Loads a resource.
     * @param module Module
     * @param name Name
     */
    static resource(module, name) {
        return new Promise((resolve, reject) => {
            fetch("modules/" + module.name.toLowerCase() + "/resources/" + name).then(response => {
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
                let script = document.createElement("script");
                // Prepare the script tag
                script.type = "text/javascript";
                script.src = "modules/" + module.toLowerCase() + "/module.js";
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