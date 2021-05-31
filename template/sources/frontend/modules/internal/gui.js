/**
 * Copyright (c) 2021 Nadav Tasher
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
					atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4MDgwODA7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPjxkaXYgbmFtZT0iZGlhbG9nIiBjb2FzdGVkIGNvbHVtbj48cCBtZWRpdW0gbGVmdCBuYW1lPSJtZXNzYWdlIj4ke21lc3NhZ2V9PC9wPjxkaXYgcm93IHN0cmV0Y2g+PGJ1dHRvbiBzbWFsbCByaWdodCBwb2ludGVyIG5hbWU9ImFwcHJvdmUiPkNsb3NlPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+"),
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
					atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4MDgwODA7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPjxkaXYgbmFtZT0iZGlhbG9nIiBjb2FzdGVkIGNvbHVtbj48cCBtZWRpdW0gbGVmdCBuYW1lPSJtZXNzYWdlIj4ke21lc3NhZ2V9PC9wPjxkaXYgcm93IHN0cmV0Y2g+PGJ1dHRvbiBzbWFsbCBsZWZ0IHBvaW50ZXIgbmFtZT0iZGVjbGluZSI+Tm88L2J1dHRvbj48YnV0dG9uIHNtYWxsIHJpZ2h0IHBvaW50ZXIgbmFtZT0iYXBwcm92ZSI+WWVzPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+"),
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
					atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IHRvcDogMDsgYm90dG9tOiAwOyBoZWlnaHQ6IDEwMCU7IHdpZHRoOiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4MDgwODA7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBzdHlsZT0ibWF4LXdpZHRoOiA1MDBweDsgcGFkZGluZzogMXZoOyIgY29sdW1uPjxkaXYgbmFtZT0iZGlhbG9nIiBjb2FzdGVkIGNvbHVtbj48aW5wdXQgbWVkaXVtIGxlZnQgcGxhY2Vob2xkZXI9IiR7cGxhY2Vob2xkZXJ9IiBuYW1lPSJpbnB1dCIvPjxkaXYgcm93IHN0cmV0Y2g+PGJ1dHRvbiBzbWFsbCBsZWZ0IHBvaW50ZXIgbmFtZT0iZGVjbGluZSI+Q2FuY2VsPC9idXR0b24+PGJ1dHRvbiBzbWFsbCByaWdodCBwb2ludGVyIG5hbWU9ImFwcHJvdmUiPkNvbmZpcm08L2J1dHRvbj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4="),
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
					atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wYXNzaXZlKTsiIHJvdz48cCBzbWFsbCBsZWZ0IHN0cmV0Y2hlZCBuYW1lPSJtZXNzYWdlIj48L3A+PGJ1dHRvbiBzbWFsbCByaWdodCBoaWRkZW4gbmFtZT0iYnV0dG9uIj5EaXNtaXNzPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+")
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
					atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wYXNzaXZlKTsiIHJvdz48cCBzbWFsbCBsZWZ0IHN0cmV0Y2hlZCBuYW1lPSJtZXNzYWdlIj48L3A+PHAgbGFyZ2Ugc3Bpbm5pbmcgY2VudGVyPiZvcGx1czs8L3A+PC9kaXY+PC9kaXY+PC9kaXY+")
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
					atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJtYXJnaW46IDAuNXZoOyBib3JkZXItcmFkaXVzOiAwLjV2aDsgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcGFzc2l2ZSk7IiByb3c+PHAgc21hbGwgbGVmdCBzdHJldGNoZWQgbmFtZT0ibWVzc2FnZSI+PC9wPjxidXR0b24gc21hbGwgcmlnaHQgcG9pbnRlciBoaWRkZW4gbmFtZT0iYnV0dG9uIj5EaXNtaXNzPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+")
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
					atob("PGRpdiBuYW1lPSJvdXRlciIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgcmlnaHQ6IDA7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IiByb3cgc3RyZXRjaD48ZGl2IG5hbWU9ImlubmVyIiBjb2x1bW4+PGRpdiBuYW1lPSJkaWFsb2ciIHN0eWxlPSJtYXJnaW46IDAuNXZoOyBib3JkZXItcmFkaXVzOiAwLjV2aDsgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcGFzc2l2ZSk7IiByb3c+PHAgc21hbGwgbGVmdCBzdHJldGNoZWQgbmFtZT0ibWVzc2FnZSI+PC9wPjxwIGxhcmdlIHNwaW5uaW5nIGNlbnRlcj4mb3BsdXM7PC9wPjwvZGl2PjwvZGl2PjwvZGl2Pg==")
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