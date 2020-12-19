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
            document.body.innerHTML = atob("PGRpdiByb3cgc3RyZXRjaD48ZGl2IHN0eWxlPSJtYXgtd2lkdGg6IDUwMHB4OyIgY29sdW1uPjxwIGxhcmdlIGNlbnRlciBpZD0idGl0bGUiPldlbGNvbWUgYmFjayE8L3A+PHAgc21hbGwgY2VudGVyPlBsZWFzZSBhdXRoZW50aWNhdGUgdG8gY29udGludWU8L3A+PGRpdiBpZD0iaW50ZXJmYWNlIiBjb2x1bW4+PGRpdiBpZD0iaW5wdXRzIiBjb2x1bW4+PGlucHV0IHNtYWxsIGxlZnQgaWQ9Im5hbWUiIHR5cGU9InRleHQiIHBsYWNlaG9sZGVyPSJOYW1lIi8+PGlucHV0IHNtYWxsIGxlZnQgaWQ9InBhc3N3b3JkIiB0eXBlPSJwYXNzd29yZCIgcGxhY2Vob2xkZXI9IlBhc3N3b3JkIi8+PC9kaXY+PGRpdiBpZD0iYnV0dG9ucyIgcm93IHN0cmV0Y2g+PHAgc21hbGwgbGVmdCBwb2ludGVyIGlkPSJ2YWxpZGF0ZSIgaGlkZGVuPlZhbGlkYXRlPC9idXR0b24+PHAgc21hbGwgcmlnaHQgcG9pbnRlciBpZD0iY29udGludWUiPkNvbnRpbnVlPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+");

            // Update the title
            UI.write("title", title);

            // Register event listeners
            UI.find("continue").addEventListener("click", (event) => {
                Toast.progress("Issuing new token...",
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