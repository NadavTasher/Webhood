// Load dependencies and resources
Module.load("UI");
Module.resources("GUI");

class Progress {
	static _progress(type, message, promise = null) {
		// Create a progress instance
		const instance = UI.populate(`progress-${type}`, { message });

		// Create closing function
		const close = () => {
			UI.remove(instance);
		};

		// Add instance to body
		document.body.appendChild(instance);

		// Check if promise is given
		if (promise) {
			// Wrap promise with closing function
			return new Promise(
				(resolve, reject) => {
					promise.then(
						(value) => {
							// Remove from DOM
							close();

							// Resolve with original value
							resolve(value);
						}
					).catch(
						(value) => {
							// Remove from DOM
							close();

							// Reject with original value
							reject(value);
						}
					)
				}
			);
		} else {
			// Return closing function
			return close;
		}
	}

	static screen(message, promise = null) {
		return Progress._progress("screen", message, promise);
	}

	static dialog(message, promise = null) {
		return Progress._progress("dialog", message, promise);
	}

	static drawer(message, promise = null) {
		return Progress._progress("drawer", message, promise);
	}
}

class Alert {
	static _alert(type, message) {
		// Create an alert instance with the message
		const instance = UI.populate(`alert-${type}`, { message });

		// Add instance to body
		document.body.appendChild(instance);

		// Return a promise for resolution
		return new Promise(
			(resolve) => {
				instance.find("close").addEventListener("click", () => {
					// Remove instance from DOM
					UI.remove(instance);

					// Resolve promise
					resolve();
				});
			}
		);
	}
	static dialog(message) {
		return Alert._alert("dialog", message);
	}

	static drawer(message) {
		return Alert._alert("drawer", message);
	}
}

class Prompt {
	static _prompt(type, title, placeholder = "Enter here") {
		// Create a alert dialog instance
		const instance = UI.populate(`prompt-${type}`, { title, placeholder });

		// Add instance to body
		document.body.appendChild(instance);

		// Create promise for handling button clicks
		return new Promise(
			(resolve, reject) => {
				// Add approve listener
				instance.find("approve").addEventListener("click", () => {
					// Remove instance from DOM
					UI.remove(instance);

					// Resolve dialog with input
					resolve(UI.read(instance.find("input")));
				});

				// Add decline listener
				instance.find("decline").addEventListener("click", () => {
					// Remove instance from DOM
					UI.remove(instance);

					// Reject dialog
					reject();
				});
			}
		);
	}

	static dialog(title, placeholder = "Enter here") {
		return Dialog._prompt("dialog", title, placeholder);
	}

	static drawer(title, placeholder = "Enter here") {
		return Dialog._prompt("drawer", title, placeholder);
	}
}