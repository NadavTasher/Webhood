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

                // Parse HTML code
                let html = atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyIgcm93IHN0cmV0Y2g+CiAgICA8ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPgogICAgICAgIDxkaXYgbmFtZT0iZGlhbG9nIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IGJvcmRlci1yYWRpdXM6IDF2aDsiIGNvbHVtbj4KICAgICAgICAgICAgPCEtLSBNZXNzYWdlIC0tPgogICAgICAgICAgICA8cCBtZWRpdW0gbGVmdCBuYW1lPSJtZXNzYWdlIj4ke21lc3NhZ2V9PC9wPgogICAgICAgICAgICA8IS0tIEJ1dHRvbiByb3cgLS0+CiAgICAgICAgICAgIDxkaXYgcm93PgogICAgICAgICAgICAgICAgPCEtLSBQbGFjZWhvbGRlciAtLT4KICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9IndpZHRoOiAxMDAlOyI+PC9kaXY+CiAgICAgICAgICAgICAgICA8IS0tIEJ1dHRvbiAtLT4KICAgICAgICAgICAgICAgIDxwIHRpbnkgY2VudGVyIHBvaW50ZXIgbmFtZT0iY2xvc2UiPkNsb3NlPC9wPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgIDwvZGl2Pgo8L2Rpdj4=");

                // Create a dialog instance
                let instance = UI.populate(html, {
                    message: message.toString()
                });

                // Hook to click listener
                instance.find("close").addEventListener("click", () => {
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
     * Displays a simple alert dialog with a title.
     * @param {string} title Title
     * @param {string} message Message
     */
    static message(title, message) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Parse HTML code
                let html = atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyIgcm93IHN0cmV0Y2g+CiAgICA8ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPgogICAgICAgIDxkaXYgbmFtZT0iZGlhbG9nIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IGJvcmRlci1yYWRpdXM6IDF2aDsiIGNvbHVtbj4KICAgICAgICAgICAgPCEtLSBUaXRsZSAtLT4KICAgICAgICAgICAgPHAgbWVkaXVtIGxlZnQgbmFtZT0idGl0bGUiPiR7dGl0bGV9PC9wPgogICAgICAgICAgICA8IS0tIE1lc3NhZ2UgLS0+CiAgICAgICAgICAgIDxwIHNtYWxsIGxlZnQgbmFtZT0ibWVzc2FnZSI+JHttZXNzYWdlfTwvcD4KICAgICAgICAgICAgPCEtLSBCdXR0b24gcm93IC0tPgogICAgICAgICAgICA8ZGl2IHJvdz4KICAgICAgICAgICAgICAgIDwhLS0gUGxhY2Vob2xkZXIgLS0+CiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSJ3aWR0aDogMTAwJTsiPjwvZGl2PgogICAgICAgICAgICAgICAgPCEtLSBCdXR0b24gLS0+CiAgICAgICAgICAgICAgICA8cCB0aW55IGNlbnRlciBwb2ludGVyIG5hbWU9ImNsb3NlIj5DbG9zZTwvcD4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+CiAgICA8L2Rpdj4KPC9kaXY+");

                // Create a dialog instance
                let instance = UI.populate(html, {
                    title: title.toString(),
                    message: message.toString()
                });

                // Hook to click listener
                instance.find("close").addEventListener("click", () => {
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
     * @param {string} title Title
     * @param {string} message Message
     */
    static confirm(title, message) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Parse HTML code
                let html = atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyIgcm93IHN0cmV0Y2g+CiAgICA8ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPgogICAgICAgIDxkaXYgbmFtZT0iZGlhbG9nIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IGJvcmRlci1yYWRpdXM6IDF2aDsiIGNvbHVtbj4KICAgICAgICAgICAgPCEtLSBUaXRsZSAtLT4KICAgICAgICAgICAgPHAgbWVkaXVtIGxlZnQgbmFtZT0idGl0bGUiPiR7dGl0bGV9PC9wPgogICAgICAgICAgICA8IS0tIE1lc3NhZ2UgLS0+CiAgICAgICAgICAgIDxwIHNtYWxsIGxlZnQgbmFtZT0ibWVzc2FnZSI+JHttZXNzYWdlfTwvcD4KICAgICAgICAgICAgPCEtLSBCdXR0b24gcm93IC0tPgogICAgICAgICAgICA8ZGl2IHJvdz4KICAgICAgICAgICAgICAgIDwhLS0gRGVjbGluZSAtLT4KICAgICAgICAgICAgICAgIDxwIHRpbnkgY2VudGVyIHBvaW50ZXIgbmFtZT0iZGVjbGluZSI+Tm88L3A+CiAgICAgICAgICAgICAgICA8IS0tIFBsYWNlaG9sZGVyIC0tPgogICAgICAgICAgICAgICAgPGRpdiBzdHlsZT0id2lkdGg6IDEwMCU7Ij48L2Rpdj4KICAgICAgICAgICAgICAgIDwhLS0gQXBwcm92ZSAtLT4KICAgICAgICAgICAgICAgIDxwIHRpbnkgY2VudGVyIHBvaW50ZXIgbmFtZT0iYXBwcm92ZSI+WWVzPC9wPgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L2Rpdj4KICAgIDwvZGl2Pgo8L2Rpdj4=");

                // Create a dialog instance
                let instance = UI.populate(html, {
                    title: title.toString(),
                    message: message.toString()
                });

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
     * @param {string} title Title
     * @param {string} placeholder Placeholder
     */
    static prompt(title, placeholder) {
        return new Promise(
            async (resolve, reject) => {
                // Await module load
                await Module.import("UI");

                // Parse HTML code
                let html = atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyIgcm93IHN0cmV0Y2g+CiAgICA8ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPgogICAgICAgIDxkaXYgbmFtZT0iZGlhbG9nIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29hc3Rlcik7IGJvcmRlci1yYWRpdXM6IDF2aDsiIGNvbHVtbj4KICAgICAgICAgICAgPCEtLSBUaXRsZSAtLT4KICAgICAgICAgICAgPHAgbWVkaXVtIGxlZnQgbmFtZT0idGl0bGUiPiR7dGl0bGV9PC9wPgogICAgICAgICAgICA8IS0tIElucHV0IC0tPgogICAgICAgICAgICA8aW5wdXQgc21hbGwgbGVmdCBwbGFjZWhvbGRlcj0iJHtwbGFjZWhvbGRlcn0iIG5hbWU9ImlucHV0IiAvPgogICAgICAgICAgICA8IS0tIEJ1dHRvbiByb3cgLS0+CiAgICAgICAgICAgIDxkaXYgcm93PgogICAgICAgICAgICAgICAgPCEtLSBDYW5jZWwgLS0+CiAgICAgICAgICAgICAgICA8cCB0aW55IGNlbnRlciBwb2ludGVyIG5hbWU9ImNhbmNlbCI+Q2FuY2VsPC9wPgogICAgICAgICAgICAgICAgPCEtLSBQbGFjZWhvbGRlciAtLT4KICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9IndpZHRoOiAxMDAlOyI+PC9kaXY+CiAgICAgICAgICAgICAgICA8IS0tIENvbmZpcm0gLS0+CiAgICAgICAgICAgICAgICA8cCB0aW55IGNlbnRlciBwb2ludGVyIG5hbWU9ImNvbmZpcm0iPkNvbmZpcm08L3A+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2PgogICAgPC9kaXY+CjwvZGl2Pg==");

                // Create a dialog instance
                let instance = UI.populate(html, {
                    title: title.toString(),
                    placeholder: placeholder.toString()
                });

                // Hook to click listeners
                instance.find("confirm").addEventListener("click", () => {
                    // Remove from body
                    UI.remove(instance);

                    // Resolve promise
                    resolve(UI.read(instance.find("input")));
                });

                instance.find("cancel").addEventListener("click", () => {
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