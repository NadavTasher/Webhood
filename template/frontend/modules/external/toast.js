/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Toast {

    /**
     * Shows a toast message at the bottom of the viewport.
     * @param {string} message Message
     * @param {boolean} dismissable Dismissable
     */
    static toast(message, dismissable = true) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Create a toast instance
                let instance = UI.populate(
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD4KICAgIDxkaXYgbmFtZT0iaW5uZXIiIGNvbHVtbj4KICAgICAgICA8ZGl2IG5hbWU9ImRpYWxvZyIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvYXN0ZXIpOyIgcm93IHN0cmV0Y2g+CiAgICAgICAgICAgIDwhLS0gTWVzc2FnZSBwYXJhZ3JhcGggLS0+CiAgICAgICAgICAgIDxwIHRpbnkgbGVmdCBuYW1lPSJtZXNzYWdlIiA+PC9wPgogICAgICAgICAgICA8IS0tIEJ1dHRvbiBwYXJhZ3JhcGggLS0+CiAgICAgICAgICAgIDxwIHRpbnkgcmlnaHQgcG9pbnRlciBoaWRkZW4gbmFtZT0iYnV0dG9uIj5EaXNtaXNzPC9wPgogICAgICAgIDwvZGl2PgogICAgPC9kaXY+CjwvZGl2Pg==")
                );

                // Check whether toast should be dismissable
                if (dismissable)
                    // Change button visibillity
                    UI.show(instance.find("button"));

                // Fill message information
                UI.write(instance.find("message"), message.toString());

                // Start a timeout for the toast
                let timeout = setTimeout(() => {
                    // Remove from body
                    UI.remove(instance);

                    // Resolve promise
                    resolve("Closed by timeout");
                }, 3000 + 100 * message.toString().length);

                // Hook to click listener
                instance.find("button").addEventListener("click", () => {
                    // Clear the timeout
                    clearTimeout(timeout);

                    // Remove from body
                    UI.remove(instance);

                    // Resolve promise
                    resolve("Closed by user");
                });

                // Append to body
                document.body.appendChild(instance);
            }
        );
    }

    /**
     * Shows a loading toast message at the bottom of the viewport.
     * @param {string} message Message
     * @param {Promise} promise Promise
     */
    static loading(message, promise = new Promise()) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");
                
                // Create a toast instance
                let instance = UI.populate(
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD4KICAgIDxkaXYgbmFtZT0iaW5uZXIiIGNvbHVtbj4KICAgICAgICA8ZGl2IG5hbWU9ImRpYWxvZyIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvYXN0ZXIpOyIgcm93IHN0cmV0Y2g+CiAgICAgICAgICAgIDwhLS0gTWVzc2FnZSBwYXJhZ3JhcGggLS0+CiAgICAgICAgICAgIDxwIHRpbnkgbGVmdCBuYW1lPSJtZXNzYWdlIiA+PC9wPgogICAgICAgICAgICA8IS0tIEJ1dHRvbiBwYXJhZ3JhcGggLS0+CiAgICAgICAgICAgIDxwIHRpbnkgcmlnaHQgcG9pbnRlciBoaWRkZW4gbmFtZT0iYnV0dG9uIj5EaXNtaXNzPC9wPgogICAgICAgIDwvZGl2PgogICAgPC9kaXY+CjwvZGl2Pg==")
                );

                // Fill message information
                UI.write(instance.find("message"), message.toString());

                // Handle promise state updates
                promise.then(
                    (result) => {
                        // Remove from body
                        UI.remove(instance);

                        // Resolve promise
                        resolve(result);
                    }
                ).catch(
                    (reason) => {
                        // Remove from body
                        UI.remove(instance);

                        // Reject promise
                        reject(reason);
                    }
                );

                // Append to body
                document.body.appendChild(instance);
            }
        );
    }
}