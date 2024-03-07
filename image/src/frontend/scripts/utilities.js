function $(selector) {
	// Returns the found element
	return document.querySelector(selector);
}

function $$(selector) {
	return document.querySelectorAll(selector);
}

function make(type, id = undefined, classes = [], children = []) {
	// Create requested element
	const element = document.createElement(type);

	// Set the requested ID
	element.id = id;

	// Add the requested classes
	element.classList.add(...classes);

	// Add the requested children
	for (const child of children)
		element.appendChild(child);

	// Return the element
	return element;
}

// Extend string prototype for easy selections
String.prototype.find = function () {
	return $(this);
};

String.prototype.findAll = function () {
	return $$(this);
};

// Extend string prototype for string interpolation
String.prototype.interpolate = function (parameters) {
	// Make sure string does not contain backticks
	if (this.includes("`")) throw new Error("String contains invalid characters");

	// Generate a new function that formats the string using ES6 template strings
	return new Function(...Object.keys(parameters), "return `" + this + "`")(...Object.values(parameters));
};

HTMLElement.prototype.read = function () {
	// Check if element is a readble input
	if (this instanceof HTMLInputElement || this instanceof HTMLTextAreaElement || this instanceof HTMLSelectElement) {
		return this.value;
	} else {
		return this.innerText;
	}
};

HTMLElement.prototype.write = function (value) {
	// Check if element is a readble input
	if (this instanceof HTMLInputElement || this instanceof HTMLTextAreaElement || this instanceof HTMLSelectElement) {
		this.value = value;
	} else {
		this.innerText = value;
	}

	// Return the element
	return this;
};

// Extend element prototype
HTMLElement.prototype.hide = function () {
	// Set the hidden attribute
	this.setAttribute("hidden", "true");

	// Return the element
	return this;
};

HTMLElement.prototype.show = function () {
	// Remove the hiding attribute
	this.removeAttribute("hidden");

	// Return the element
	return this;
};

HTMLElement.prototype.clear = function () {
	// Clear the element
	this.innerHTML = "";

	// Return the element
	return this;
};

HTMLElement.prototype.remove = function () {
	// Find the parent
	const parent = this.parentNode;

	// Remove child from parent
	parent.removeChild(this);

	// Return the element
	return this;
};

HTMLElement.prototype.view = function (history = true) {
	// Replace history state
	window.history.replaceState(preserveState(), document.title);

	// Hide all siblings
	for (const child of this.parentNode.children) {
		child.hide();
	}

	// Show focused view
	this.show();

	// Add new history state
	if (history) window.history.pushState(preserveState(), document.title);

	// Return the element
	return this;
};

HTMLElement.prototype.populate = function (parameters = {}) {
	// Sanitize value using the default HTML sanitiser of the target browser
	const sanitizer = document.createElement("p");

	// Sanitize parameters
	for (const key in parameters) {
		if (key in parameters) {
			// Set the internal value as text
			sanitizer.innerText = parameters[key].toString();

			// Extract sanitized value
			parameters[key] = sanitizer.innerHTML;
		}
	}

	// Create a wrapper element
	const wrapperElement = document.createElement("div");

	// Append HTML to wrapper element
	wrapperElement.innerHTML = this.innerHTML.interpolate(parameters);

	// Add functions to the wrapper
	wrapperElement.find = (elementName) => {
		// Return element
		return wrapperElement.querySelector(`[name=${elementName}]`);
	};

	// Return created wrapper
	return wrapperElement;
};

function preserveState() {
	// Initialize state map and elements
	const state = {};
	const elements = document.getElementsByTagName("*");

	// Loop over all elements and store state
	for (const element of elements) {
		// Make sure element has an ID
		if (element.id.length === 0) element.id = Math.random().toString(36).slice(2);

		// Add element to state map
		state[element.id] = element.hasAttribute("hidden");
	}
	return state;
}

function restoreState(state = {}) {
	// Restore state map
	for (const [id, hidden] of Object.entries(state)) {
		try {
			// Fetch the element
			const element = document.getElementById(id);

			// Hide or show (from state)
			if (hidden) {
				element.hide();
			} else {
				element.show();
			}
		} catch (ignored) {
			// Log the error
			console.error(`Failed restoring state of element ${id}`);
		}
	}
}

window.addEventListener("popstate", (event) => {
	// Restore state from event
	restoreState(event.state);
});

window.addEventListener("load", () => {
	// Query viewport element
	const element = document.querySelector(`meta[name="viewport"]`);

	// Make sure viewport exists
	if (element !== null)
		// Update viewport height to lock the viewport height (prevents keyboard resizes)
		element.content = element.content.replace("device-height", Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
});
