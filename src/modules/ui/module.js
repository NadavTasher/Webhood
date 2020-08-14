/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Register a popstate listener to restore states.
window.addEventListener("popstate", (event) => {
    // Change contents
    History.restore(event.state);
});

class History {
    /**
     * Creates a preservable state for all elements in the page.
     */
    static preserve() {
        // Initialize map
        let state = [];
        // Find all elements
        let elements = document.getElementsByTagName("*");
        // Loop over all elements
        for (let element of elements) {
            // Make sure the element has an ID
            if (element.id.length === 0) {
                element.id = Math.floor(Math.random() * 1000000).toString();
            }
            // Add to object
            state.push([element.id, element.hasAttribute("hidden")]);
        }
        // Return map
        return state;
    }

    /**
     * Restores a preserved state for elements in the page.
     * @param state State
     */
    static restore(state = []) {
        // Loop over map
        for (let [id, value] of state) {
            if (value) {
                UI.hide(id);
            } else {
                UI.show(id);
            }
        }
    }
}

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
     * Removes all children of a given view.
     * @param v View
     */
    static clear(v) {
        // Store view
        let view = UI.find(v);
        // Remove all views
        view.innerHTML = "";
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
     * Changes a view's visibility.
     * @param v View
     */
    static view(v) {
        // Add history
        window.history.replaceState(History.preserve(), document.title);
        // Change views
        for (let view of Array.from(arguments)) {
            // Store view
            let element = UI.find(view);
            // Store parent
            let parent = element.parentNode;
            // Hide all
            for (let child of parent.children) {
                UI.hide(child);
            }
            // Show view
            UI.show(element);
        }
        // Add history
        window.history.pushState(History.preserve(), document.title);
    }

    /**
     * Reads a view's value.
     * @param v View
     */
    static read(v) {
        // Find view
        let element = UI.find(v);
        // Check type
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
            return element.value;
        } else {
            return element.innerText;
        }
    }

    /**
     * Writes a view's value.
     * @param v View
     * @param value Value
     */
    static write(v, value) {
        // Find view
        let element = UI.find(v);
        // Check type
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
            element.value = value;
        } else {
            element.innerText = value;
        }
    }

    /**
     * Populates a template.
     * @param template Template
     * @param parameters Parameters
     * @return HTMLElement
     */
    static populate(template, parameters = {}) {
        // Find the template
        let templateElement = UI.find(template);
        // If the element is null, create one
        if (templateElement === null) {
            templateElement = document.createElement("template");
            // Fill the contents
            templateElement.innerHTML = template;
        }
        // Store the HTML in a temporary variable
        let html = templateElement.innerHTML;
        // Replace parameters
        for (let key in parameters) {
            if (key in parameters) {
                // Create the searching values
                let search = "${" + key + "}";
                let value = parameters[key];
                // Sanitize value using the default HTML sanitiser of the target browser
                let sanitizer = document.createElement("p");
                sanitizer.innerText = value;
                value = sanitizer.innerHTML;
                // Replace all instances
                while (html.includes(search))
                    html = html.replace(search, value);
            }
        }
        // Create a wrapper element
        let wrapperElement = document.createElement("div");
        // Append HTML to wrapper element
        wrapperElement.innerHTML = html;
        // Add functions to the wrapper
        wrapperElement.find = (elementName) => {
            // Return element
            return wrapperElement.querySelector(`[name=${elementName}]`);
        };
        // Return created wrapper
        return wrapperElement;
    }
}