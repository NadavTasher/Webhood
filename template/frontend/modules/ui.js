// Extend string prototype
String.prototype.find = function () {
	return UI.find(this.toString());
};
String.prototype.hide = function () {
	return UI.hide(this.toString());
};
String.prototype.show = function () {
	return UI.show(this.toString());
};
String.prototype.clear = function () {
	return UI.clear(this.toString());
};
String.prototype.remove = function () {
	return UI.remove(this.toString());
};
String.prototype.view = function (history = true) {
	return UI.view(this.toString(), history);
};
String.prototype.read = function () {
	return UI.read(this.toString());
};
String.prototype.write = function (value) {
	return UI.write(this.toString(), value);
};
String.prototype.populate = function (parameters = {}) {
	return UI.populate(this.toString(), parameters);
};

class UI {
	static find(input) {
		if (typeof String() === typeof input) {
			if (document.getElementById(input) !== null) {
				return document.getElementById(input);
			}
			return null;
		}
		return input;
	}

	static hide(input) {
		UI.find(input).setAttribute("hidden", "true");
	}

	static show(input) {
		UI.find(input).removeAttribute("hidden");
	}

	static clear(input) {
		UI.find(input).innerHTML = "";
	}

	static remove(input) {
		// Find element and parent
		const element = UI.find(input);
		const parent = element.parentNode;

		// Remove child from parent
		parent.removeChild(element);
	}

	static view(input, history = true) {
		// Replace history state
		window.history.replaceState(UI._preserve(), document.title);

		// Find element and parent
		const element = UI.find(input);
		const parent = element.parentNode;

		// Hide all siblings
		for (const child of parent.children) {
			UI.hide(child);
		}

		// Show focused view
		UI.show(element);

		// Add new history state
		if (history) window.history.pushState(UI._preserve(), document.title);
	}

	static read(input) {
		// Find element
		const element = UI.find(input);

		// Check if element is a readble input
		if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
			return element.value;
		} else {
			return element.innerText;
		}
	}

	static write(input, value) {
		// Find element
		const element = UI.find(v);

		// Check if element is a readble input
		if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
			element.value = value;
		} else {
			element.innerText = value;
		}
	}

	static populate(template, parameters = {}) {
		// Find the template
		const templateElement = UI.find(template);

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

	static _preserve() {
		// Initialize state map and elements
		const state = {};
		const elements = document.getElementsByTagName("*");

		for (const element of elements) {
			// Make sure element has an ID
			if (element.id.length === 0) element.id = Math.random().toString(36).slice(2);

			// Add element to state map
			state[element.id] = element.hasAttribute("hidden");
		}
		return state;
	}

	static _restore(state = {}) {
		// Restore state map
		for (const [id, hidden] of Object.entries(state)) {
			if (hidden) {
				UI.hide(id);
			} else {
				UI.show(id);
			}
		}
	}
}

// Register a popstate listener to restore states.
window.addEventListener("popstate", (event) => {
	UI._restore(event.state);
});
