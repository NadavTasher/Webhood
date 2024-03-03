function makeElement(type, classes = [], children = []) {
	// Create requested element
	const element = document.createElement(type);

	// Add the requested classes
	element.classList.add(...classes);

	// Add the requested children
	for (const child of children)
		element.appendChild(child);

	// Return the element
	return element;
}
function makeOverlay(children) {
	return makeElement("div", classes=["screen"], children=children);
}

function makePopup(children) {
	return makeElement("div", classes=["limited"], children=[
		// Create popup container
		makeElement("div", classes=["coasted", "popup"], children=children)
	]);
}

function makeDrawer(children) {
	return makeElement("div", classes=["drawer"], children=children)
}

function makeContainer(...children) {
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

function makeAlert(message, closeText, closeCallback) {
	// Create the alert message
	const messageParagraph = makeElement("p", classes=["medium", "left"]);

	// Write the message to the element
	messageParagraph.write(message);

	// Create the close button
	const closeButton = makeElement("button", classes=["small", "center"]);
	
	// Add the button text
	closeButton.write(closeText)

	// Add a click listener for the button
	closeButton.addEventListener("click", closeCallback);

	// Return the children
	return [messageParagraph, closeButton];
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
	const screenElement = makeOverlay(containerGenerator(titleParagraph, inputElement, buttonContainer));

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
	loadingContainer.classList.add("loader");

	// Append spinner and message to container
	loadingContainer.appendChild(spinnerElement);
	loadingContainer.appendChild(messageParagraph);

	// Create the screen
	const screenElement = makeOverlay(containerGenerator(loadingContainer));

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
	const removeCallback = createLoading(message, makeContainer);

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
	const removeCallback = createLoading(message, makeDrawer);

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
		makeAlert(message, makePopup, closeText, resolve);
	});
}

function alertDrawer(message, closeText = "Close") {
	// Return a promise for resolution
	return new Promise((resolve) => {
		// Create the alert dialog
		makeAlert(message, makeDrawer, closeText, resolve);
	});
}

function promptDialog(title, placeholder = "Enter here", inputType = "text", approveText = "Ok", declineText = "Cancel") {
	// Return a promise for resolution
	return new Promise((resolve, reject) => {
		// Create the prompt dialog
		createPrompt(title, placeholder, inputType, makePopup, approveText, declineText, resolve, reject);
	});
}

function promptDrawer(title, placeholder = "Enter here", inputType = "text", approveText = "Ok", declineText = "Cancel") {
	// Return a promise for resolution
	return new Promise((resolve, reject) => {
		// Create the prompt dialog
		createPrompt(title, placeholder, inputType, makeDrawer, approveText, declineText, resolve, reject);
	});
}
