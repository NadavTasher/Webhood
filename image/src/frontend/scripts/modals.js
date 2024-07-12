const KEY_TO_CLASS = {
	Enter: "approve",
	Escape: "decline",
};

window.addEventListener("keyup", (event) => {
	// Find all overlays
	const overlays = $$(".overlay");

	// If no overlays are defined, return
	if (!overlays.length) return;

	// Find the top-most overlay
	const overlay = overlays[overlays.length - 1];

	// Make sure overlay is the last element of the body
	if (document.body.childNodes[document.body.childNodes.length - 1] !== overlay) return;

	// Check if the event is supported
	if (!(event.key in KEY_TO_CLASS)) return;

	// Find the button for the pressed keycode
	const button = overlay.querySelector(`.${KEY_TO_CLASS[event.key]}`);

	// If button is not defined, return
	if (!button) return;

	// Click the button!
	button.click();
});

function make(type, classes = [], children = []) {
	// Create requested element
	const element = document.createElement(type);

	// Add the requested classes
	for (const item of classes) {
		element.classList.add(item);
	}

	// Add the requested children
	for (const child of children) element.appendChild(child);

	// Return the element
	return element;
}

function makeOverlay(children) {
	return make("div", ["overlay"], children);
}

function makePopup(children, buttons) {
	return make("div", ["limited", "coasted"], [...children, make("div", ["buttons"], buttons)]);
}

function progressScreen(message, promise = undefined) {
	// Create the progress screen
	const overlay = makeOverlay([make("div", ["spinner", "spinning"]), make("p", ["large", "center"]).write(message)]);

	// Add the overlay to the screen
	document.body.appendChild(overlay);

	// If no promise is defined, just return the callback
	if (!promise) return () => overlay.remove();

	// Wrap promise with closing function
	return new Promise((resolve, reject) => {
		promise
			.then((value) => {
				// Remove from DOM
				overlay.remove();

				// Resolve with original value
				resolve(value);
			})
			.catch((error) => {
				// Remove from DOM
				overlay.remove();

				// Reject with original error
				reject(error);
			});
	});
}

function alertDialog(message, closeText = "Ok") {
	// Create the alert message
	const messageParagraph = make("p", ["medium", "left"]).write(message);

	// Create the close button
	const closeButton = make("button", ["small", "center", "approve", "decline"]).write(closeText);

	// Create overlay
	const overlay = makeOverlay([makePopup([messageParagraph], [closeButton])]);

	// Add a click listener for the button
	closeButton.addEventListener("click", () => overlay.remove());

	// Add a click listener for the overlay
	overlay.addEventListener("click", (event) => event.target === overlay && closeButton.click());

	// Add the overlay to the screen
	document.body.appendChild(overlay);

	// Return a promise for resolution
	return new Promise((resolve) => {
		// Add a click listener for the button
		closeButton.addEventListener("click", () => {
			// Call the resolve callback
			resolve();
		});
	});
}

function confirmDialog(message, approveText = "Ok", declineText = "Cancel") {
	// Create the prompt title
	const titleParagraph = make("p", ["medium", "left"]).write(message);

	// Create the approve and decline buttons
	const approveButton = make("button", ["small", "center", "approve"]).write(approveText);
	const declineButton = make("button", ["small", "center", "decline"]).write(declineText);

	// Create overlay
	const overlay = makeOverlay([makePopup([titleParagraph], [declineButton, approveButton])]);

	// Add a click listener for the approve and decline buttons
	approveButton.addEventListener("click", () => overlay.remove());
	declineButton.addEventListener("click", () => overlay.remove());

	// Add a click listener for the overlay
	overlay.addEventListener("click", (event) => event.target === overlay && declineButton.click());

	// Add the overlay to the screen
	document.body.appendChild(overlay);

	// Return a promise for resolution
	return new Promise((resolve, reject) => {
		// Add a click listener for the approve and decline buttons
		approveButton.addEventListener("click", () => resolve());
		declineButton.addEventListener("click", () => reject(`User clicked ${declineText}`));
	});
}

function promptDialog(title, placeholder = "Enter here", inputType = "text", approveText = "Ok", declineText = "Cancel") {
	// Create the prompt title
	const titleParagraph = make("p", ["medium", "left"]).write(title);

	// Create the prompt input
	const inputElement = make("input", ["small", "left"]);

	// Add some styling to the input
	inputElement.type = inputType;
	inputElement.placeholder = placeholder;

	// Create the approve and decline buttons
	const approveButton = make("button", ["small", "center", "approve"]).write(approveText);
	const declineButton = make("button", ["small", "center", "decline"]).write(declineText);

	// Create overlay
	const overlay = makeOverlay([makePopup([titleParagraph, inputElement], [declineButton, approveButton])]);

	// Add a click listener for the approve and decline buttons
	approveButton.addEventListener("click", () => overlay.remove());
	declineButton.addEventListener("click", () => overlay.remove());

	// Add a click listener for the overlay
	overlay.addEventListener("click", (event) => event.target === overlay && declineButton.click());

	// Add the overlay to the screen
	document.body.appendChild(overlay);

	// Return a promise for resolution
	return new Promise((resolve, reject) => {
		// Add a click listener for the approve and decline buttons
		approveButton.addEventListener("click", () => resolve(inputElement.value));
		declineButton.addEventListener("click", () => reject(`User clicked ${declineText}`));
	});
}
