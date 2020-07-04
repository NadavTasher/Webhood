/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/WebTemplate/
 **/

class Authenticate {

    // API name
    static API = "authenticate";

    // Holds the token
    static token = null;

    // Holds the page's contents
    static contents = null;

    /**
     * Authenticates the user by requiring sign-up, sign-in and token validation.
     */
    static initialize() {
        return new Promise((resolve, reject) => {
            // Load the token
            Authenticate.token = localStorage.getItem(Authenticate.name.toLowerCase());
            // Load the page's contents
            Authenticate.contents = document.body.innerHTML;
            // Load the template
            Template.load(Authenticate.name, "authenticate").then((template) => {
                // Clear the body
                UI.clear(document.body);
                // Append a populated template
                document.body.appendChild(Template.populate(template, {
                    title: document.title
                }));
                // Check token initialization
                if (Authenticate.token !== null) {
                    // Hide the inputs
                    UI.hide("inputs");
                    // Change the output message
                    Authenticate.output("Hold on - Authenticating...");
                    // Send the API call
                    API.call(Authenticate.name.toLowerCase(), "validate", {
                        token: Authenticate.token
                    }).then(result => {
                        // Change the page's contents
                        document.body.innerHTML = Authenticate.contents;
                        // Clear the contents
                        Authenticate.contents = null;
                        // Resolve
                        resolve();
                    }).catch(result => {
                        // Show the inputs
                        UI.show("inputs");
                        // Change the output message
                        Authenticate.output(result, true);
                        // Reject
                        reject(result);
                    });
                }
            });
        });
    }

    /**
     * Sends a signUp API call and handles the results.
     */
    static signUp() {
        return new Promise((resolve, reject) => {
            // Hide the inputs
            UI.hide("inputs");
            // Change the output message
            Authenticate.output("Hold on - Signing you up...");
            // Send the API call
            API.call(Authenticate.name.toLowerCase(), "signUp", {
                name: UI.find("name").value,
                password: UI.find("password").value
            }).then(result => {
                // Call the signIn function
                Authenticate.signIn().then(resolve).catch(reject);
            }).catch(result => {
                // Show the inputs
                UI.show("inputs");
                // Change the output message
                Authenticate.output(result, true);
                // Reject
                reject(result);
            });
        });
    }

    /**
     * Sends a signIn API call and handles the results.
     */
    static signIn() {
        return new Promise((resolve, reject) => {
            // Hide the inputs
            UI.hide("inputs");
            // Change the output message
            Authenticate.output("Hold on - Signing you in...");
            // Send the API call
            API.call(Authenticate.name.toLowerCase(), "signIn", {
                name: UI.find("name").value,
                password: UI.find("password").value
            }).then(result => {
                // Push the token
                localStorage.setItem(Authenticate.name.toLowerCase(), Authenticate.token = result);
                // Resolve
                resolve();
            }).catch(result => {
                // Show the inputs
                UI.show("inputs");
                // Change the output message
                Authenticate.output(result, true);
                // Reject
                reject(result);
            });
        });
    }

    /**
     * Signs the user out.
     */
    static signOut() {
        // Remove from localStorage
        localStorage.removeItem(Authenticate.name.toLowerCase());
    }

    /**
     * Changes the output message.
     * @param text Output message
     * @param error Is the message an error?
     */
    static output(text, error = false) {
        // Store the output view
        let output = UI.find("output");
        // Set the output message
        output.innerText = text;
        // Check if the message is an error
        if (error) {
            // Set the text color to red
            output.style.setProperty("color", "red");
        } else {
            // Clear the text color
            output.style.removeProperty("color");
        }
    }

}