/**
 * Copyright (c) 2019 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Authenticate {
    /**
     * Authenticates the user by requiring sign-up, sign-in and token validation.
     */
    static initialize(title = document.title) {
        return new Promise((resolve, reject) => {
            // Preserve the HTML
            let contents = document.body.innerHTML;
            // Load the new HTML
            Module.resource(Authenticate.name, "authenticate.html").then((html) => {
                // Set the new HTML
                document.body.innerHTML = html;
                // Store elements
                let titleElement = UI.find("title");
                let outputElement = UI.find("output");
                // Update the title
                titleElement.innerText = "Welcome to " + title;
                // Register event listeners
                UI.find("signUp").addEventListener("click", (event) => {
                    // Hide the UI
                    UI.hide("interface");
                    // Display progress
                    outputElement.innerText = "Hold on - Signing up...";
                    outputElement.style.setProperty("color", null);
                    // Try to sign up
                    API.call(Authenticate.name.toLowerCase(), "signUp", {
                        name: UI.find("name").value,
                        password: UI.find("password").value
                    }).then((value) => {
                        // Click the signIn button
                        UI.find("signIn").click();
                    }).catch((reason) => {
                        // Display reason
                        outputElement.innerText = reason;
                        outputElement.style.setProperty("color", "red");
                        // Show the UI
                        UI.show("interface");
                    });
                });
                UI.find("signIn").addEventListener("click", (event) => {
                    // Hide the UI
                    UI.hide("interface");
                    // Display progress
                    outputElement.innerText = "Hold on - Signing in...";
                    outputElement.style.setProperty("color", null);
                    // Try to sign in
                    API.call(Authenticate.name.toLowerCase(), "signIn", {
                        name: UI.find("name").value,
                        password: UI.find("password").value
                    }).then((token) => {
                        // Store the token
                        Authenticate.token(token);
                        // Click the validate button
                        UI.find("validate").click();
                    }).catch((reason) => {
                        // Display reason
                        outputElement.innerText = reason;
                        outputElement.style.setProperty("color", "red");
                        // Show the UI
                        UI.show("interface");
                    });
                });
                UI.find("validate").addEventListener("click", (event) => {
                    // Hide the UI
                    UI.hide("interface");
                    // Display progress
                    outputElement.innerText = "Hold on - Validating...";
                    outputElement.style.setProperty("color", null);
                    // Try to validate
                    API.call(Authenticate.name.toLowerCase(), "validate", {
                        token: Authenticate.token()
                    }).then((userID) => {
                        // Restore the HTML
                        document.body.innerHTML = contents;
                        // Resolve
                        resolve(userID);
                    }).catch((reason) => {
                        // Display reason
                        outputElement.innerText = reason;
                        outputElement.style.setProperty("color", "red");
                        // Show the UI
                        UI.show("interface");
                    });
                });
                // Automatic validation
                if (Authenticate.token() !== null) {
                    // Click the validate button
                    UI.find("validate").click();
                } else {
                    // Show the UI
                    UI.show("interface");
                }
            });
        });
    }

    /**
     * Returns the authentication token.
     */
    static token(token = null) {
        // Check the token
        if (token !== null)
            // Set the token
            localStorage.setItem(Authenticate.name.toLowerCase(), token);
        // Return the token
        return localStorage.getItem(Authenticate.name.toLowerCase());
    }

    /**
     * Signs the user out.
     */
    static finalize() {
        // Remove from localStorage
        localStorage.removeItem(Authenticate.name.toLowerCase());
    }
}