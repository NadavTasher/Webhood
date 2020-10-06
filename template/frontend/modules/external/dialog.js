/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class Dialog {

    /**
     * Displays a simple alert dialog.
     * @param {string} message Message
     */
    static alert(message) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Create a dialog instance
                let instance = UI.populate(
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4MDgwODA7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPjxkaXYgbmFtZT0iZGlhbG9nIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IGJvcmRlci1yYWRpdXM6IDF2aDsiIGNvbHVtbj48cCBzbWFsbCBsZWZ0IG5hbWU9Im1lc3NhZ2UiPiR7bWVzc2FnZX08L3A+PGRpdiByb3cgc3RyZXRjaD48cCB0aW55IHJpZ2h0IHBvaW50ZXIgbmFtZT0iYXBwcm92ZSI+Q2xvc2U8L3A+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+"),
                    {
                        message: message.toString()
                    }
                );

                // Hook to click listener
                instance.find("approve").addEventListener("click", () => {
                    // Remove from body
                    UI.remove(instance);

                    // Resolve promise
                    resolve();
                });

                // Append to body
                document.body.appendChild(instance);
            }
        );
    }

    /**
     * Displays a simple confirmation dialog.
     * @param {string} message Message
     */
    static confirm(message) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Create a dialog instance
                let instance = UI.populate(
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4MDgwODA7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPjxkaXYgbmFtZT0iZGlhbG9nIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IGJvcmRlci1yYWRpdXM6IDF2aDsiIGNvbHVtbj48cCBzbWFsbCBsZWZ0IG5hbWU9Im1lc3NhZ2UiPiR7bWVzc2FnZX08L3A+PGRpdiByb3cgc3RyZXRjaD48cCB0aW55IGxlZnQgcG9pbnRlciBuYW1lPSJkZWNsaW5lIj5ObzwvcD48cCB0aW55IHJpZ2h0IHBvaW50ZXIgbmFtZT0iYXBwcm92ZSI+WWVzPC9wPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pg=="),
                    {
                        message: message.toString()
                    }
                );

                // Hook to click listeners
                instance.find("approve").addEventListener("click", () => {
                    // Remove from body
                    UI.remove(instance);

                    // Resolve promise
                    resolve("Approved by user");
                });

                instance.find("decline").addEventListener("click", () => {
                    // Remove from body
                    UI.remove(instance);

                    // Reject promise
                    reject("Declined by user");
                });

                // Append to body
                document.body.appendChild(instance);
            }
        );
    }

    /**
     * Displays a simple prompt with an input placeholder.
     * @param {string} placeholder Placeholder
     */
    static prompt(placeholder) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Create a dialog instance
                let instance = UI.populate(
                    atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4MDgwODA7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPjxkaXYgbmFtZT0iZGlhbG9nIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IGJvcmRlci1yYWRpdXM6IDF2aDsiIGNvbHVtbj48aW5wdXQgc21hbGwgbGVmdCBwbGFjZWhvbGRlcj0iJHtwbGFjZWhvbGRlcn0iIG5hbWU9ImlucHV0Ii8+PGRpdiByb3cgc3RyZXRjaD48cCB0aW55IGxlZnQgcG9pbnRlciBuYW1lPSJkZWNsaW5lIj5DYW5jZWw8L3A+PHAgdGlueSByaWdodCBwb2ludGVyIG5hbWU9ImFwcHJvdmUiPkNvbmZpcm08L3A+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+"),
                    {
                        placeholder: placeholder.toString()
                    }
                );

                // Hook to click listeners
                instance.find("approve").addEventListener("click", () => {
                    // Remove from body
                    UI.remove(instance);

                    // Resolve promise
                    resolve(UI.read(instance.find("input")));
                });

                instance.find("decline").addEventListener("click", () => {
                    // Remove from body
                    UI.remove(instance);

                    // Reject promise
                    reject("Cancelled by user");
                });

                // Append to body
                document.body.appendChild(instance);
            }
        );
    }
}