/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Authenticate {
    /**
     * Authenticates the user by requiring sign-up, sign-in and token validation.
     */
    static initialize(title = document.title) {
        return new Promise(async (resolve, reject) => {
            // Await module imports
            await Module.import("API", "UI");

            // Preserve the HTML
            let contents = document.body.innerHTML;

            // Load the new HTML
            document.body.innerHTML = atob("PGRpdiByb3cgc3RyZXRjaD4KICAgIDxkaXYgc3R5bGU9Im1heC13aWR0aDogNTAwcHg7IiBjb2x1bW4+CiAgICAgICAgPCEtLSBUaXRsZXMgLS0+CiAgICAgICAgPHAgbGFyZ2UgY2VudGVyIGlkPSJ0aXRsZSI+V2VsY29tZSBiYWNrITwvcD4KICAgICAgICA8cCBzbWFsbCBjZW50ZXIgaWQ9Im91dHB1dCI+UGxlYXNlIGF1dGhlbnRpY2F0ZSB0byBjb250aW51ZTwvcD4KICAgICAgICA8IS0tIFVzZXIgaW50ZXJmYWNlcyAtLT4KICAgICAgICA8ZGl2IGlkPSJpbnRlcmZhY2UiIGhpZGRlbiBjb2x1bW4+CiAgICAgICAgICAgIDwhLS0gSW5wdXRzIC0tPgogICAgICAgICAgICA8ZGl2IGlkPSJpbnB1dHMiIGNvbHVtbj4KICAgICAgICAgICAgICAgIDxpbnB1dCBtZWRpdW0gbGVmdCBpZD0ibmFtZSIgdHlwZT0idGV4dCIgcGxhY2Vob2xkZXI9Ik5hbWUiIC8+CiAgICAgICAgICAgICAgICA8aW5wdXQgbWVkaXVtIGxlZnQgaWQ9InBhc3N3b3JkIiB0eXBlPSJwYXNzd29yZCIgcGxhY2Vob2xkZXI9IlBhc3N3b3JkIiAvPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPCEtLSBCdXR0b25zIC0tPgogICAgICAgICAgICA8ZGl2IGlkPSJidXR0b25zIiBjb2x1bW4+CiAgICAgICAgICAgICAgICA8ZGl2IHJvdyBzdHJldGNoPgogICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWVkaXVtIGNlbnRlciBpZD0ic2lnblVwIj5TaWduIFVwPC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBtZWRpdW0gY2VudGVyIGlkPSJzaWduSW4iPlNpZ24gSW48L2J1dHRvbj4KICAgICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICAgICAgPGRpdiBoaWRkZW4gY29sdW1uPgogICAgICAgICAgICAgICAgICAgIDxidXR0b24gbWVkaXVtIGNlbnRlciBpZD0idmFsaWRhdGUiPlZhbGlkYXRlPC9idXR0b24+CiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KPC9kaXY+");

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
                API.call("authenticate".toLowerCase(), "signUp", {
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
                API.call("authenticate".toLowerCase(), "signIn", {
                    name: UI.find("name").value,
                    password: UI.find("password").value
                }).then((token) => {
                    // Store the token
                    this.token(token);

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
                API.call("authenticate".toLowerCase(), "validate", {
                    token: this.token()
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
            if (this.token() !== null) {
                // Click the validate button
                UI.find("validate").click();
            } else {
                // Show the UI
                UI.show("interface");
            }
        });
    }

    /**
     * Returns the authentication token.
     */
    static token(token = null) {
        // Check the token
        if (token !== null)
            // Set the token
            localStorage.setItem("token", token);
        // Return the token
        return localStorage.getItem("token");
    }

    /**
     * Signs the user out.
     */
    static finalize() {
        // Remove from localStorage
        localStorage.removeItem("token");
    }
}