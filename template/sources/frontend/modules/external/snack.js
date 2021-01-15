/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Snack {

    /**
     * Shows a timeout snack message at the bottom of the viewport.
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
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2FzdGVyKTsiIHJvdyBzdHJldGNoPjxwIHRpbnkgbGVmdCBuYW1lPSJtZXNzYWdlIj48L3A+PHAgdGlueSByaWdodCBwb2ludGVyIGhpZGRlbiBuYW1lPSJidXR0b24iPkRpc21pc3M8L3A+PC9kaXY+PC9kaXY+PC9kaXY+")
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
     * Shows a progress snack message at the bottom of the viewport.
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
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb2FzdGVyKTsiIHJvdyBzdHJldGNoPjxwIHRpbnkgbGVmdCBuYW1lPSJtZXNzYWdlIj48L3A+PHAgdGlueSByaWdodCBwb2ludGVyIGhpZGRlbiBuYW1lPSJidXR0b24iPkRpc21pc3M8L3A+PC9kaXY+PC9kaXY+PC9kaXY+")
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