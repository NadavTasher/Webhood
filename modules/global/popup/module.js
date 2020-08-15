/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Modules/
 **/

class Popup {
    /**
     * Shows a simple message.
     * @param title Title
     * @param message Message
     * @return Promise
     */
    static alert(title, message) {
        return new Promise((resolve, reject) => {
            fetch(Module.location(Popup, "resources/alert.widget"))
                // Parse as plaintext
                .then(response => response.text())
                // Handle HTML
                .then(html => {
                    // Initialize view
                    let view = UI.populate(html, {
                        title: title,
                        message: message
                    });
                    // Add event listeners
                    view.find("close").addEventListener("click", () => {
                        // Remove popup
                        UI.remove(view);
                        // Resolve promise
                        resolve();
                    });
                    // Append view
                    document.body.appendChild(view);
                })
                .catch(reject);
        });
    }

    /**
     * Prompts for input.
     * @param title Title
     * @param placeholder Placeholder
     * @return Promise
     */
    static prompt(title, placeholder = "Input") {
        return new Promise((resolve, reject) => {
            fetch(Module.location(Popup, "resources/prompt.widget"))
                // Parse as plaintext
                .then(response => response.text())
                // Handle HTML
                .then(html => {
                    // Initialize view
                    let view = UI.populate(html, {
                        title: title,
                        placeholder: placeholder
                    });
                    // Add event listeners
                    view.find("finish").addEventListener("click", () => {
                        // Remove popup
                        UI.remove(view);
                        // Resolve promise
                        resolve(UI.read(view.find("input")));
                    });
                    view.find("cancel").addEventListener("click", () => {
                        // Remove popup
                        UI.remove(view);
                        // Reject promise
                        reject("Canceled by user");
                    });
                    // Append view
                    document.body.appendChild(view);
                })
                .catch(reject);
        });
    }
}