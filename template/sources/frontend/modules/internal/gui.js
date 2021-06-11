/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// GUI resources
const resourcesGUI = "PCEtLSBHZW5lcmFsIHN0eWxlIGZvciBhbGwgR1VJIGVsZW1lbnRzIC0tPgo8c3R5bGU+CgkvKiBTaXppbmcgYW5kIHBvc2l0aW9uaW5nICovCglbc2NyZWVuXSB7CgkJcG9zaXRpb246IGZpeGVkOwoJfQoKCVtzY3JlZW5dIHsKCQlsZWZ0OiAwOwoJCXJpZ2h0OiAwOwoJCXdpZHRoOiAxMDAlOwoJfQoKCVtzY3JlZW5dIHsKCQl0b3A6IDA7CgkJYm90dG9tOiAwOwoJCWhlaWdodDogMTAwJTsKCX0KCglbZGlhbG9nXSB7CgkJcGFkZGluZzogMnZoOwoJfQoKCVtkcmF3ZXJdIHsKCQlwYWRkaW5nOiAydmg7CgkJbWF4LWhlaWdodDogMzB2aDsKCQlhbGlnbi1zZWxmOiBmbGV4LWVuZDsKCX0KCglbc3Bpbm5lcl0gewoJCXdpZHRoOiAzdmg7CgkJaGVpZ2h0OiAzdmg7CgkJbWFyZ2luOiAxdmg7CgkJYWxpZ24tc2VsZjogY2VudGVyOwoJfQoKCVtsaW1pdGVkXSB7CgkJbWluLXdpZHRoOiA0MHZ3OwoJCW1heC13aWR0aDogNzB2dzsKCX0KCgkvKiBUaGVtaW5nIGFuZCBzdHlsaW5nICovCglbZGltbWVkXSB7CgkJYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDMwOwoJfQoKCVtzcGlubmVyXSB7CgkJYm9yZGVyLXdpZHRoOiAxdmg7CgkJYm9yZGVyLXJhZGl1czogNTAlOwoJCWJvcmRlci1zdHlsZTogc29saWQ7CgkJYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDsKCQlib3JkZXItdG9wLWNvbG9yOiB2YXIoLS10ZXh0KTsKCX0KCglbZHJhd2VyXSB7CgkJYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcGFzc2l2ZSk7Cgl9Cjwvc3R5bGU+CjwhLS0gTWFya3VwIGZvciBhbGwgR1VJIGVsZW1lbnRzIC0tPgo8dGVtcGxhdGUgaWQ9InByb2dyZXNzLXNjcmVlbiI+Cgk8ZGl2IHNjcmVlbiBkaW1tZWQ+CgkJPGRpdiBzcGlubmVyIHNwaW5uaW5nPjwvZGl2PgoJCTxwIGxhcmdlIGNlbnRlcj4ke21lc3NhZ2V9PC9wPgoJPC9kaXY+CjwvdGVtcGxhdGU+Cjx0ZW1wbGF0ZSBpZD0icHJvZ3Jlc3MtZGlhbG9nIj4KCTxkaXYgc2NyZWVuIGRpbW1lZCByb3c+CgkJPGRpdiBsaW1pdGVkPgoJCQk8ZGl2IGNvYXN0ZWQgc3RyZXRjaGVkIGRpYWxvZyByb3c+CgkJCQk8ZGl2IHNwaW5uZXIgc3Bpbm5pbmc+PC9kaXY+CgkJCQk8cCBtZWRpdW0gY2VudGVyPiR7bWVzc2FnZX08L3A+CgkJCTwvZGl2PgoJCTwvZGl2PgoJPC9kaXY+CjwvdGVtcGxhdGU+Cjx0ZW1wbGF0ZSBpZD0icHJvZ3Jlc3MtZHJhd2VyIj4KCTxkaXYgc2NyZWVuIGRpbW1lZCByb3c+CgkJPGRpdiBkcmF3ZXIgc3RyZXRjaGVkPgoJCQk8ZGl2IHNwaW5uZXIgc3Bpbm5pbmc+PC9kaXY+CgkJCTxwIG1lZGl1bSBjZW50ZXI+JHttZXNzYWdlfTwvcD4KCQk8L2Rpdj4KCTwvZGl2Pgo8L3RlbXBsYXRlPgo8dGVtcGxhdGUgaWQ9ImFsZXJ0LWRpYWxvZyI+Cgk8ZGl2IHNjcmVlbiBkaW1tZWQgcm93PgoJCTxkaXYgbGltaXRlZD4KCQkJPGRpdiBjb2FzdGVkIHN0cmV0Y2hlZCBkaWFsb2c+CgkJCQk8cCBtZWRpdW0gbGVmdD4ke21lc3NhZ2V9PC9wPgoJCQkJPGJ1dHRvbiBtZWRpdW0gY2VudGVyIG5hbWU9ImNsb3NlIj5DbG9zZTwvYnV0dG9uPgoJCQk8L2Rpdj4KCQk8L2Rpdj4KCTwvZGl2Pgo8L3RlbXBsYXRlPgo8dGVtcGxhdGUgaWQ9ImFsZXJ0LWRyYXdlciI+Cgk8ZGl2IHNjcmVlbiBkaW1tZWQgcm93PgoJCTxkaXYgZHJhd2VyIHN0cmV0Y2hlZD4KCQkJPHAgbWVkaXVtIGxlZnQ+JHttZXNzYWdlfTwvcD4KCQkJPGJ1dHRvbiBtZWRpdW0gY2VudGVyIG5hbWU9ImNsb3NlIj5DbG9zZTwvYnV0dG9uPgoJCTwvZGl2PgoJPC9kaXY+CjwvdGVtcGxhdGU+Cjx0ZW1wbGF0ZSBpZD0icHJvbXB0LWRpYWxvZyI+Cgk8ZGl2IHNjcmVlbiBkaW1tZWQgcm93PgoJCTxkaXYgbGltaXRlZD4KCQkJPGRpdiBjb2FzdGVkIHN0cmV0Y2hlZCBkaWFsb2c+CgkJCQk8cCBtZWRpdW0gbGVmdD4ke3RpdGxlfTwvcD4KCQkJCTxpbnB1dCBtZWRpdW0gbGVmdCBuYW1lPSJpbnB1dCIgcGxhY2Vob2xkZXI9IiR7cGxhY2Vob2xkZXJ9IiAvPgoJCQkJPGRpdiByb3cgc3RyZXRjaD4KCQkJCQk8YnV0dG9uIG1lZGl1bSBjZW50ZXIgbmFtZT0iZGVjbGluZSI+Q2FuY2VsPC9idXR0b24+CgkJCQkJPGJ1dHRvbiBtZWRpdW0gY2VudGVyIG5hbWU9ImFwcHJvdmUiPk9rPC9idXR0b24+CgkJCQk8L2Rpdj4KCQkJPC9kaXY+CgkJPC9kaXY+Cgk8L2Rpdj4KPC90ZW1wbGF0ZT4KPHRlbXBsYXRlIGlkPSJwcm9tcHQtZHJhd2VyIj4KCTxkaXYgc2NyZWVuIGRpbW1lZCByb3c+CgkJPGRpdiBkcmF3ZXIgc3RyZXRjaGVkPgoJCQk8cCBtZWRpdW0gbGVmdD4ke3RpdGxlfTwvcD4KCQkJPGlucHV0IG1lZGl1bSBsZWZ0IG5hbWU9ImlucHV0IiBwbGFjZWhvbGRlcj0iJHtwbGFjZWhvbGRlcn0iIC8+CgkJCTxkaXYgcm93IHN0cmV0Y2g+CgkJCQk8YnV0dG9uIG1lZGl1bSBjZW50ZXIgbmFtZT0iZGVjbGluZSI+Q2FuY2VsPC9idXR0b24+CgkJCQk8YnV0dG9uIG1lZGl1bSBjZW50ZXIgbmFtZT0iYXBwcm92ZSI+T2s8L2J1dHRvbj4KCQkJPC9kaXY+CgkJPC9kaXY+Cgk8L2Rpdj4KPC90ZW1wbGF0ZT4=";

// Install resources
document.head.innerHTML += atob(resourcesGUI);

// Load dependencies
Module.load("UI");

class Progress {

	/**
	 * Shows a full screen loading screen.
	 * @param {String} message Loading text
	 * @param {Promise} promise Optional promise
	 */
	static screen(message, promise = null) {
		// Create a progress screen instance
		const instance = UI.populate("progress-screen", { message: message });

		// Create closing function
		const close = () => {
			UI.remove(instance);
		};

		// Append to body
		document.body.appendChild(instance);

		// Check if promise is given
		if (promise) {
			// Wrap promise
			return new Promise(
				(resolve, reject) => {
					promise.then(
						(value) => {
							close();
							resolve(value);
						}
					).catch(
						(value) => {
							close();
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

	/**
	 * Shows a dialog loading screen.
	 * @param {String} message Loading text
	 * @param {Promise} promise Optional promise
	 */
	static dialog(message, promise = null) {
		// Create a progress dialog instance
		const instance = UI.populate("progress-dialog", { message: message });

		// Create closing function
		const close = () => {
			UI.remove(instance);
		};

		// Append to body
		document.body.appendChild(instance);

		// Check if promise is given
		if (promise) {
			// Wrap promise
			return new Promise(
				(resolve, reject) => {
					promise.then(
						(value) => {
							close();
							resolve(value);
						}
					).catch(
						(value) => {
							close();
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

	/**
	 * Shows a drawer loading screen.
	 * @param {String} message Loading text
	 * @param {Promise} promise Optional promise
	 */
	static drawer(message, promise = null) {
		// Create a progress drawer instance
		const instance = UI.populate("progress-drawer", { message: message });

		// Create closing function
		const close = () => {
			UI.remove(instance);
		};

		// Append to body
		document.body.appendChild(instance);

		// Check if promise is given
		if (promise) {
			// Wrap promise
			return new Promise(
				(resolve, reject) => {
					promise.then(
						(value) => {
							close();
							resolve(value);
						}
					).catch(
						(value) => {
							close();
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
}

class Alert {

	/**
	 * Shows a dialog alert message.
	 * @param {String} message Alert message
	 */
	static dialog(message) {
		// Create a alert dialog instance
		const instance = UI.populate("alert-dialog", { message: message });

		// Append to body
		document.body.appendChild(instance);

		// Wrap promise
		return new Promise(
			(resolve) => {
				instance.find("close").addEventListener("click", () => {
					// Close instance
					UI.remove(instance);
					// Resolve promise
					resolve();
				});
			}
		);
	}

	/**
	 * Shows a drawer alert message.
	 * @param {String} message Alert message
	 */
	static drawer(message) {
		// Create a alert drawer instance
		const instance = UI.populate("alert-drawer", { message: message });

		// Append to body
		document.body.appendChild(instance);

		// Wrap promise
		return new Promise(
			(resolve) => {
				instance.find("close").addEventListener("click", () => {
					// Close instance
					UI.remove(instance);
					// Resolve promise
					resolve();
				});
			}
		);
	}
}

class Prompt {

	/**
	 * Shows a dialog prompt message.
	 * @param {String} title Prompt title
	 * @param {String} placeholder Prompt input placeholder
	 */
	static dialog(title, placeholder = "Enter here") {
		// Create a alert dialog instance
		const instance = UI.populate("prompt-dialog", { title: title, placeholder: placeholder });

		// Append to body
		document.body.appendChild(instance);

		// Wrap promise
		return new Promise(
			(resolve, reject) => {
				instance.find("approve").addEventListener("click", () => {
					// Close instance
					UI.remove(instance);
					// Resolve promise
					resolve(UI.read(instance.find("input")));
				});
				instance.find("decline").addEventListener("click", () => {
					// Close instance
					UI.remove(instance);
					// Reject promise
					reject();
				});
			}
		);
	}

	/**
	 * Shows a drawer prompt message.
	 * @param {String} title Prompt title
	 * @param {String} placeholder Prompt input placeholder
	 */
	static drawer(title, placeholder = "Enter here") {
		// Create a alert dialog instance
		const instance = UI.populate("prompt-drawer", { title: title, placeholder: placeholder });

		// Append to body
		document.body.appendChild(instance);

		// Wrap promise
		return new Promise(
			(resolve, reject) => {
				instance.find("approve").addEventListener("click", () => {
					// Close instance
					UI.remove(instance);
					// Resolve promise
					resolve(UI.read(instance.find("input")));
				});
				instance.find("decline").addEventListener("click", () => {
					// Close instance
					UI.remove(instance);
					// Reject promise
					reject();
				});
			}
		);
	}
}