/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Authenticate {
    /**
     * Authenticates the user by requiring sign-up, sign-in and token validation.
     */
    static initialize(title = `Welcome to ${document.title}`) {
        return new Promise(async (resolve, reject) => {
            // Await module imports
            await Module.import("API", "UI", "External:Toast");

            // Preserve the HTML
            let contents = document.body.innerHTML;

            // Load the new HTML
            document.body.innerHTML = atob("PGRpdiByb3cgc3RyZXRjaD48ZGl2IHN0eWxlPSJtYXgtd2lkdGg6IDUwMHB4OyIgY29sdW1uPjxwIGxhcmdlIGNlbnRlciBpZD0idGl0bGUiPldlbGNvbWUgYmFjayE8L3A+PHAgc21hbGwgY2VudGVyPlBsZWFzZSBhdXRoZW50aWNhdGUgdG8gY29udGludWU8L3A+PGRpdiBpZD0iaW50ZXJmYWNlIiBjb2x1bW4+PGRpdiBpZD0iaW5wdXRzIiBjb2x1bW4+PGlucHV0IG1lZGl1bSBsZWZ0IGlkPSJuYW1lIiB0eXBlPSJ0ZXh0IiBwbGFjZWhvbGRlcj0iTmFtZSIvPjxpbnB1dCBtZWRpdW0gbGVmdCBpZD0icGFzc3dvcmQiIHR5cGU9InBhc3N3b3JkIiBwbGFjZWhvbGRlcj0iUGFzc3dvcmQiLz48L2Rpdj48ZGl2IGlkPSJidXR0b25zIiByb3cgc3RyZXRjaD48YnV0dG9uIG1lZGl1bSBsZWZ0IHBvaW50ZXIgaWQ9InZhbGlkYXRlIiBoaWRkZW4+VmFsaWRhdGU8L2J1dHRvbj48YnV0dG9uIG1lZGl1bSByaWdodCBwb2ludGVyIGlkPSJjb250aW51ZSI+Q29udGludWU8L2J1dHRvbj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4=");

            // Update the title
            UI.write("title", title);

            // Register event listeners
            UI.find("continue").addEventListener("click", (event) => {
                Toast.progress("Issuing new token...",
                    API.call("authenticate", "issue", {
                        name: UI.read("name"),
                        password: UI.read("password")
                    })
                ).then(
                    (token) => {
                        // Save the token
                        localStorage.token = token;

                        // Click the validation button
                        UI.find("validate").click();
                    }
                ).catch(Toast.timeout);
            });

            UI.find("validate").addEventListener("click", (event) => {
                Toast.progress("Validating token...",
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
                ).catch(Toast.timeout);
            });

            // Automatic validation
            if (localStorage.token) {
                // Click the validation button
                UI.find("validate").click();
            }
        });
    }
}