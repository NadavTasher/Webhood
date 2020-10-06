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
            await Module.import("API", "UI", "External:Toast");

            // Preserve the HTML
            let contents = document.body.innerHTML;

            // Load the new HTML
            document.body.innerHTML = atob("PGRpdiByb3cgc3RyZXRjaD4KICAgIDxkaXYgc3R5bGU9Im1heC13aWR0aDogNTAwcHg7IiBjb2x1bW4+CiAgICAgICAgPCEtLSBUaXRsZXMgLS0+CiAgICAgICAgPHAgbGFyZ2UgY2VudGVyIGlkPSJ0aXRsZSI+V2VsY29tZSBiYWNrITwvcD4KICAgICAgICA8cCBzbWFsbCBjZW50ZXI+UGxlYXNlIGF1dGhlbnRpY2F0ZSB0byBjb250aW51ZTwvcD4KICAgICAgICA8IS0tIFVzZXIgaW50ZXJmYWNlcyAtLT4KICAgICAgICA8ZGl2IGlkPSJpbnRlcmZhY2UiIGNvbHVtbj4KICAgICAgICAgICAgPCEtLSBJbnB1dHMgLS0+CiAgICAgICAgICAgIDxkaXYgaWQ9ImlucHV0cyIgY29sdW1uPgogICAgICAgICAgICAgICAgPGlucHV0IHNtYWxsIGxlZnQgaWQ9Im5hbWUiIHR5cGU9InRleHQiIHBsYWNlaG9sZGVyPSJOYW1lIiAvPgogICAgICAgICAgICAgICAgPGlucHV0IHNtYWxsIGxlZnQgaWQ9InBhc3N3b3JkIiB0eXBlPSJwYXNzd29yZCIgcGxhY2Vob2xkZXI9IlBhc3N3b3JkIiAvPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPCEtLSBCdXR0b25zIC0tPgogICAgICAgICAgICA8ZGl2IGlkPSJidXR0b25zIiByb3cgc3RyZXRjaD4KICAgICAgICAgICAgICAgIDxwIHNtYWxsIGxlZnQgcG9pbnRlciBpZD0idmFsaWRhdGUiIGhpZGRlbj5WYWxpZGF0ZTwvYnV0dG9uPgogICAgICAgICAgICAgICAgPHAgc21hbGwgcmlnaHQgcG9pbnRlciBpZD0iY29udGludWUiPkNvbnRpbnVlPC9idXR0b24+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgPC9kaXY+CjwvZGl2Pg==");

            // Update the title
            UI.write("title", `Welcome to ${title}`);

            // Register event listeners
            UI.find("continue").addEventListener("click", (event) => {
                Toast.loading("Issuing new token...",
                    API.call("authenticate", "issue", {
                        name: UI.find("name").value,
                        password: UI.find("password").value
                    })
                ).then(
                    (token) => {
                        // Save the token
                        localStorage.token = token;

                        // Click the validation button
                        UI.find("validate").click();
                    }
                ).catch(
                    (reason) => {
                        // Display reason
                        Toast.toast(reason);
                    }
                );
            });

            UI.find("validate").addEventListener("click", (event) => {
                Toast.loading("Validating token...",
                    API.call("authenticate", "validate", {
                        token: localStorage.token
                    })
                ).then(
                    (id) => {
                        // Restore the HTML
                        document.body.innerHTML = contents;

                        // Resolve promise
                        resolve(id);
                    }
                ).catch(
                    (reason) => {
                        // Display reason
                        Toast.toast(reason);
                    }
                );
            });

            // Automatic validation
            if (localStorage.token) {
                // Click the validation button
                UI.find("validate").click();
            }
        });
    }
}