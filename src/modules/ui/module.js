/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/WebTemplate/
 **/

class UI {
    /**
     * Returns a view by its ID or by it's own value.
     * @param v View
     * @returns {HTMLElement} View
     */
    static find(v) {
        if (typeof "" === typeof v || typeof '' === typeof v) {
            // ID lookup
            if (document.getElementById(v) !== undefined) {
                return document.getElementById(v);
            }
            // Query lookup
            if (document.querySelector(v) !== undefined) {
                return document.querySelector(v);
            }
        }
        // Return the input
        return v;
    }

    /**
     * Hides a given view.
     * @param v View
     */
    static hide(v) {
        // Set style to none
        UI.find(v).setAttribute("hidden", "true");
    }

    /**
     * Shows a given view.
     * @param v View
     */
    static show(v) {
        // Set style to original value
        UI.find(v).removeAttribute("hidden");
    }

    /**
     * Removes a given view.
     * @param v View
     */
    static remove(v) {
        // Find view
        let element = UI.find(v);
        // Remove
        element.parentNode.removeChild(element);
    }

    /**
     * Shows a given view while hiding it's brothers.
     * @param v View
     */
    static view(v) {
        // Store view
        let element = UI.find(v);
        // Store parent
        let parent = element.parentNode;
        // Hide all
        for (let child of parent.children) {
            UI.hide(child);
        }
        // Show view
        UI.show(element);
    }

    /**
     * Sets a given target as the only visible part of the page.
     * @param target View
     */
    static page(target) {
        // Store current target
        let temporary = UI.find(target);
        // Recursively get parent
        while (temporary.parentNode !== document.body && temporary.parentNode !== document.body) {
            // View temporary
            UI.view(temporary);
            // Set temporary to it's parent
            temporary = temporary.parentNode;
        }
        // View temporary
        UI.view(temporary);
    }

    /**
     * Removes all children of a given view.
     * @param v View
     */
    static clear(v) {
        // Store view
        let view = UI.find(v);
        // Remove all views
        view.innerHTML = "";
    }
}

class Template {
    /**
     * Creates a template from HTML.
     * @param module Module
     * @param template Template
     */
    static load(module, template) {
        return new Promise((resolve, reject) => {
            fetch("modules/" + Module.name(module) + "/templates/" + template + ".html").then(response => {
                response.text().then(contents => {
                    // Create the template
                    let template = document.createElement("template");
                    // Fill the template
                    template.innerHTML = contents;
                    // Resolve
                    resolve(template);
                }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Populates a template.
     * @param template Template
     * @param parameters Parameters
     */
    static populate(template, parameters = {}) {
        // Find the template
        let templateElement = UI.find(template);
        // Create the element
        let created = templateElement.cloneNode(true);
        // Add the HTML
        let html = created.innerHTML;
        // Replace parameters
        for (let key in parameters) {
            if (key in parameters) {
                let search = "${" + key + "}";
                let value = parameters[key];
                // Sanitize value
                let sanitizer = document.createElement("p");
                sanitizer.innerText = value;
                value = sanitizer.innerHTML;
                // Replace
                while (html.includes(search))
                    html = html.replace(search, value);
            }
        }
        created.innerHTML = html;
        // Return created element
        return created.content;
    }
}