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
	const closeButton = make("button", ["small", "center"]).write(closeText);

	// Create overlay
	const overlay = makeOverlay([makePopup([messageParagraph], [closeButton])]);

	// Add a click listener for the button
	closeButton.addEventListener("click", () => overlay.remove());

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
	const approveButton = make("button", ["small", "center"]).write(approveText);
	const declineButton = make("button", ["small", "center"]).write(declineText);

	// Create overlay
	const overlay = makeOverlay([makePopup([titleParagraph], [declineButton, approveButton])]);

	// Add a click listener for the approve and decline buttons
	approveButton.addEventListener("click", () => overlay.remove());
	declineButton.addEventListener("click", () => overlay.remove());

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
	const approveButton = make("button", ["small", "center"]).write(approveText);
	const declineButton = make("button", ["small", "center"]).write(declineText);

	// Create overlay
	const overlay = makeOverlay([makePopup([titleParagraph, inputElement], [declineButton, approveButton])]);

	// Add a click listener for the approve and decline buttons
	approveButton.addEventListener("click", () => overlay.remove());
	declineButton.addEventListener("click", () => overlay.remove());

	// Add the overlay to the screen
	document.body.appendChild(overlay);

	// Return a promise for resolution
	return new Promise((resolve, reject) => {
		// Add a click listener for the approve and decline buttons
		approveButton.addEventListener("click", () => resolve(inputElement.value));
		declineButton.addEventListener("click", () => reject(`User clicked ${declineText}`));
	});
}
