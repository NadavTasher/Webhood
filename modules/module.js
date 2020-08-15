/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Initialize sources
const MODULE_SOURCES_CORE = "core";
const MODULE_SOURCES_GLOBAL = "global";

// Initialize sources object
const MODULE_SOURCES = {
    [MODULE_SOURCES_CORE]: "https://nadavtasher.github.io/Template/modules/core",
    [MODULE_SOURCES_GLOBAL]: "https://nadavtasher.github.io/Template/modules/global",
};

class Module {

    /**
     * Imports a module.
     * @param name Name
     */
    static import(name) {
        // Transform name
        let moduleName = name.toLowerCase();
        // Initialize default sources
        let moduleSources = MODULE_SOURCES_CORE;
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
            }
        }
        // Assemble URL and import module
        return import([MODULE_SOURCES[moduleSources], moduleName, "module.js"].join("/"));
    }
}