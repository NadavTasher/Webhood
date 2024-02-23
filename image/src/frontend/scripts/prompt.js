function createScreen(...children) {
	// Create a new screen div element
	const screenElement = document.createElement("div");

	// Add the required style classes
	screenElement.classList.add("screen");

	// Append the childred
	for (const child of children) {
		screenElement.appendChild(child);
	}

	// Return the screen element
	return screenElement;
}

function createDialog(...children) {
	// Create a div for the dialog
	const dialogContainer = document.createElement("div");

	// Add the limited class to the container
	dialogContainer.classList.add("limited-container");

	// Create the dialog element
	const dialogElement = document.createElement("div");

	// Make the dialog look like a dialog
	dialogElement.classList.add("coasted", "dialog-container");

	// Append the children
	for (const child of children) {
		dialogElement.appendChild(child);
	}

	// Add the dialog to the container
	dialogContainer.appendChild(dialogElement);

	// Return the container
	return dialogContainer;
}

function createDrawer(...children) {
	// Create the drawer element
	const drawerElement = document.createElement("div");

	// Make the drawer look like a drawer
	drawerElement.classList.add("drawer-container");

	// Append the children
	for (const child of children) {
		drawerElement.appendChild(child);
	}

	// Return the drawer
	return drawerElement;
}

function createContainer(...children) {
	// Create the container element
	const containerElement = document.createElement("div");

	// Add some styling to the container
	containerElement.classList.add("default-container");

	// Append the children
	for (const child of children) {
		containerElement.appendChild(child);
	}

	// Return the container
	return containerElement;
}

function createAlert(message, containerGenerator, closeText, closeCallback = undefined) {
	// Create the alert message
	const messageParagraph = document.createElement("p");

	// Add some styling to the message
	messageParagraph.classList.add("medium", "left");

	// Set the message's text
	messageParagraph.innerText = message;

	// Create the alert button
	const closeButton = document.createElement("button");

	// Add some styling to the button
	closeButton.classList.add("small", "center");

	// Set the button's text
	closeButton.innerText = closeText;

	// Create the screen
	const screenElement = createScreen(containerGenerator(messageParagraph, closeButton));

	// Add a click listener for the button
	closeButton.addEventListener("click", () => {
		// Remove the screen from the body
		screenElement.parentNode.removeChild(screenElement);

		// Call the additional callback
		if (closeCallback) closeCallback();
	});

	// Add the alert to display
	document.body.appendChild(screenElement);
}

function createPrompt(title, placeholder, inputType, containerGenerator, approveText, declineText, approveCallback = undefined, declineCallback = undefined) {
	// Create the prompt title
	const titleParagraph = document.createElement("p");

	// Add some styling to the title
	titleParagraph.classList.add("medium", "left");

	// Set the title's text
	titleParagraph.innerText = title;

	// Create the prompt input
	const inputElement = document.createElement("input");

	// Add some styling to the input
	inputElement.type = inputType;
	inputElement.placeholder = placeholder;
	inputElement.classList.add("small", "left");

	// Create buttons container
	const buttonContainer = document.createElement("div");

	// Add some styling to the container
	buttonContainer.classList.add("buttons-container");

	// Create the approve and decline buttons
	const approveButton = document.createElement("button");
	const declineButton = document.createElement("button");

	// Add some styling to the buttons
	approveButton.classList.add("small", "center");
	declineButton.classList.add("small", "center");

	// Add some text to the buttons
	approveButton.innerText = approveText;
	declineButton.innerText = declineText;

	// Add buttons to container
	buttonContainer.appendChild(approveButton);
	buttonContainer.appendChild(declineButton);

	// Create the screen
	const screenElement = createScreen(containerGenerator(titleParagraph, inputElement, buttonContainer));

	// Add a click listener for the approve button
	approveButton.addEventListener("click", () => {
		// Remove the screen from the body
		screenElement.parentNode.removeChild(screenElement);

		// Call the additional callback
		if (approveCallback) approveCallback(inputElement.value);
	});

	// Add a click listener for the decline button
	declineButton.addEventListener("click", () => {
		// Remove the screen from the body
		screenElement.parentNode.removeChild(screenElement);

		// Call the additional callback
		if (declineCallback) declineCallback();
	});

	// Add the prompt to display
	document.body.appendChild(screenElement);
}

function createLoading(message, containerGenerator) {
	// Create the spinner element
	const spinnerElement = document.createElement("div");

	// Add some styling to the spinner
	spinnerElement.classList.add("spinner", "spinning");

	// Create the alert message
	const messageParagraph = document.createElement("p");

	// Add some styling to the message
	messageParagraph.classList.add("medium", "center");

	// Set the message's text
	messageParagraph.innerText = message;

	// Create the container element
	const loadingContainer = document.createElement("div");

	// Add some styling to the container
	loadingContainer.classList.add("loading-container");

	// Append spinner and message to container
	loadingContainer.appendChild(spinnerElement);
	loadingContainer.appendChild(messageParagraph);

	// Create the screen
	const screenElement = createScreen(containerGenerator(loadingContainer));

	// Add the alert to display
	document.body.appendChild(screenElement);

	// Return a closing callback
	return () => {
		// Remove the screen from the body
		screenElement.parentNode.removeChild(screenElement);
	};
}

function loadingScreen(message, promise = undefined) {
	// Create the loading screen
	const removeCallback = createLoading(message, createContainer);

	// If no promise is defined, just return the callback
	if (!promise) return removeCallback;

	// Wrap promise with closing function
	return new Promise((resolve, reject) => {
		promise
			.then((value) => {
				// Remove from DOM
				removeCallback();

				// Resolve with original value
				resolve(value);
			})
			.catch((error) => {
				// Remove from DOM
				removeCallback();

				// Reject with original error
				reject(error);
			});
	});
}

function loadingDrawer(message, promise = undefined) {
	// Create the loading screen
	const removeCallback = createLoading(message, createDrawer);

	// If no promise is defined, just return the callback
	if (!promise) return removeCallback;

	// Wrap promise with closing function
	return new Promise((resolve, reject) => {
		promise
			.then((value) => {
				// Remove from DOM
				removeCallback();

				// Resolve with original value
				resolve(value);
			})
			.catch((error) => {
				// Remove from DOM
				removeCallback();

				// Reject with original error
				reject(error);
			});
	});
}

function alertDialog(message, closeText = "Close") {
	// Return a promise for resolution
	return new Promise((resolve) => {
		// Create the alert dialog
		createAlert(message, createDialog, closeText, resolve);
	});
}

function alertDrawer(message, closeText = "Close") {
	// Return a promise for resolution
	return new Promise((resolve) => {
		// Create the alert dialog
		createAlert(message, createDrawer, closeText, resolve);
	});
}

function promptDialog(title, placeholder = "Enter here", inputType = "text", approveText = "Ok", declineText = "Cancel") {
	// Return a promise for resolution
	return new Promise((resolve, reject) => {
		// Create the prompt dialog
		createPrompt(title, placeholder, inputType, createDialog, approveText, declineText, resolve, reject);
	});
}

function promptDrawer(title, placeholder = "Enter here", inputType = "text", approveText = "Ok", declineText = "Cancel") {
	// Return a promise for resolution
	return new Promise((resolve, reject) => {
		// Create the prompt dialog
		createPrompt(title, placeholder, inputType, createDrawer, approveText, declineText, resolve, reject);
	});
}
