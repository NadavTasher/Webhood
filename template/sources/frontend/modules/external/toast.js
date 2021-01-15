/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Toast {

    /**
     * Shows a timeout toast message at the bottom of the viewport.
     * @param {string} message Message
     * @param {boolean} dismissable Dismissable
     */
    static timeout(message, dismissable = true) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Create a toast instance
                let instance = UI.populate(
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJtYXJnaW46IDAuNXZoOyBib3JkZXItcmFkaXVzOiAwLjV2aDsgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IiByb3cgc3RyZXRjaD48cCB0aW55IGxlZnQgbmFtZT0ibWVzc2FnZSI+PC9wPjxwIHRpbnkgcmlnaHQgcG9pbnRlciBoaWRkZW4gbmFtZT0iYnV0dG9uIj5EaXNtaXNzPC9wPjwvZGl2PjwvZGl2PjwvZGl2Pg==")
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
     * Shows a progress toast message at the bottom of the viewport.
     * @param {string} message Message
     * @param {Promise} promise Promise
     */
    static progress(message, promise) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");
                
                // Create a toast instance
                let instance = UI.populate(
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJtYXJnaW46IDAuNXZoOyBib3JkZXItcmFkaXVzOiAwLjV2aDsgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IiByb3cgc3RyZXRjaD48cCB0aW55IGxlZnQgbmFtZT0ibWVzc2FnZSI+PC9wPjxwIHRpbnkgcmlnaHQgcG9pbnRlciBoaWRkZW4gbmFtZT0iYnV0dG9uIj5EaXNtaXNzPC9wPjwvZGl2PjwvZGl2PjwvZGl2Pg==")
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