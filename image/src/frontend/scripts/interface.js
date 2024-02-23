// Lock the viewport height to prevent keyboard resizes
window.addEventListener("load", function () {
	// Query viewport element
	const element = document.querySelector(`meta[name="viewport"]`);

	// Make sure viewport exists
	if (element !== null)
		// Update viewport height
		element.content = element.content.replace("device-height", Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
});

// Register a popstate listener to restore states.
window.addEventListener("popstate", (event) => {
	_restore(event.state);
});

// History preservation function
function _preserve() {
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

// History restoration function
function _restore(state = {}) {
	// Restore state map
	for (const [id, hidden] of Object.entries(state)) {
		if (hidden) {
			hide(id);
		} else {
			show(id);
		}
	}
}

function find(input) {
	if (typeof String() === typeof input) {
		if (document.getElementById(input) !== null) {
			return document.getElementById(input);
		}
		return null;
	}
	return input;
}

function hide(input) {
	find(input).setAttribute("hidden", "true");
}

function show(input) {
	find(input).removeAttribute("hidden");
}

function clear(input) {
	find(input).innerHTML = "";
}

function remove(input) {
	// Find element and parent
	const element = find(input);
	const parent = element.parentNode;

	// Remove child from parent
	parent.removeChild(element);
}

function view(input, history = true) {
	// Replace history state
	window.history.replaceState(_preserve(), document.title);

	// Find element and parent
	const element = find(input);
	const parent = element.parentNode;

	// Hide all siblings
	for (const child of parent.children) {
		hide(child);
	}

	// Show focused view
	show(element);

	// Add new history state
	if (history) window.history.pushState(_preserve(), document.title);
}

function read(input) {
	// Find element
	const element = find(input);

	// Check if element is a readble input
	if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
		return element.value;
	} else {
		return element.innerText;
	}
}

function write(input, value) {
	// Find element
	const element = find(input);

	// Check if element is a readble input
	if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
		element.value = value;
	} else {
		element.innerText = value;
	}
}

function populate(template, parameters = {}) {
	// Find the template
	let templateElement = find(template);

	// If the element is null, create one
	if (templateElement === null) {
		templateElement = document.createElement("template");

		// Fill the contents
		templateElement.innerHTML = template;
	}

	// Store the HTML in a temporary variable
	let innerHTML = templateElement.innerHTML;

	// Replace parameters
	for (const key in parameters) {
		if (key in parameters) {
			// Create the searching values
			const search = "${" + key + "}";

			// Sanitize value using the default HTML sanitiser of the target browser
			const sanitizer = document.createElement("p");
			sanitizer.innerText = parameters[key];

			// Extract sanitized value
			const value = sanitizer.innerHTML;

			// Make sure the replacement value does not contain the original search value and replace occurences
			if (!value.includes(search)) while (innerHTML.includes(search)) innerHTML = innerHTML.replace(search, value);
		}
	}

	// Create a wrapper element
	const wrapperElement = document.createElement("div");

	// Append HTML to wrapper element
	wrapperElement.innerHTML = innerHTML;

	// Add functions to the wrapper
	wrapperElement.find = (elementName) => {
		// Return element
		return wrapperElement.querySelector(`[name=${elementName}]`);
	};

	// Return created wrapper
	return wrapperElement;
}

// Extend string prototype
String.prototype.find = function () {
	return find(this.toString());
};
String.prototype.hide = function () {
	return hide(this.toString());
};
String.prototype.show = function () {
	return show(this.toString());
};
String.prototype.clear = function () {
	return clear(this.toString());
};
String.prototype.remove = function () {
	return remove(this.toString());
};
String.prototype.view = function (history = true) {
	return view(this.toString(), history);
};
String.prototype.read = function () {
	return read(this.toString());
};
String.prototype.write = function (value) {
	return write(this.toString(), value);
};
String.prototype.populate = function (parameters = {}) {
	return populate(this.toString(), parameters);
};
