/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Style resources
const resourcesEditor = "PCEtLSBHZW5lcmFsIHN0eWxlIGZvciBlZGl0b3IgZWxlbWVudHMgLS0+CjxzdHlsZT4KCVtlZGl0b3JdIHsKCQlkaXNwbGF5OiBibG9jazsKCX0KCglbZWRpdG9yXSA+IHNwYW4gewoJCXdoaXRlLXNwYWNlOiBwcmU7Cgl9Cjwvc3R5bGU+";

// Install resources
document.head.innerHTML += atob(resourcesEditor);

// Load dependencies
Module.load("UI");

class Editor {

	/**
	 * Renders a text editor.
	 * @param {String} view View to work on
	 * @param {Object} options Keyword bindings
	 * @returns Lines
	 */
	static render(view, callback = (type, text, line) => { }, options = {
		"comments": {
			"color": "#669352",
			"prefix": "#"
		},
		"variables": {
			"color": "#9cdcfe"
		},
		"keywords": {}
	}, separators = /\s\./) {
		// Check options for default variables and types
		if (!Validator.valid(options, { "comments": { "color": "string", "prefix": "string" } }))
			options.comments = { "color": "#669352", "prefix": "#" };
		if (!Validator.valid(options, { "variables": { "color": "string" } }))
			options.variables = { "color": "#9cdcfe" };
		if (!Validator.valid(options, { "keywords": "object" }))
			options.keywords = {};

		// Find view in page
		view = UI.find(view);

		// Define constants
		const text = UI.read(view);
		const regex = new RegExp(`(?=[${separators}])|(?<=[${separators}])`);

		// Split text to lines
		const lines = text.split("\n");

		// Create HTML contents
		let elements = [];

		// Loop over each line and parse it
		for (const index in lines) {
			// Append new line
			if (elements.length > 0)
				elements.push(document.createElement("br"));

			// Append line finder
			const hook = document.createElement("span");
			hook.id = view.id + "-" + index;
			elements.push(hook);

			// Find line text
			const line = lines[index];

			// Check for comment
			if (line.startsWith(options.comments.prefix)) {
				// Add span to element
				elements.push(Editor._span(line, options.comments.color, () => {
					callback("comment", line, index);
				}));
			} else {
				// Parse each word
				const words = line.split(regex);

				// Loop over each word and parse it
				for (const word of words) {
					// Load styles
					let color;

					// Find proper properties
					for (let type in options.keywords) {
						if (Validator.valid(type, { "color": "string", "values": "array" }))
							if (options.keywords[type].values.includes(word))
								color = options.keywords[type].color;
					}

					// Add spans to element
					elements.push(Editor._span(word, color ? color : options.variables.color, () => {
						callback(color ? "keyword" : "variable", word, index);
					}));
				}
			}
		}

		// Clear view of current elements
		UI.clear(view);

		// Append all children to view
		for (const element of elements)
			view.appendChild(element);

		// Make the view an editor
		view.setAttribute("editor", "true");
		view.setAttribute("spellcheck", "false");
		view.setAttribute("contenteditable", "true");

		// Return lines
		return lines;
	}

	/**
	 * Creates a span with text, color and click event.
	 * @param {String} text Text in span
	 * @param {String} color Color in span
	 * @param {FUnction} click Click function
	 * @returns Span
	 */
	static _span(text, color = "var(--text)", click = () => { }) {
		// Create span
		let span = document.createElement("span");

		// Update span with values
		span.innerText = text;
		span.style.color = color;

		// Add event listeners
		span.addEventListener("click", () => {
			click();
		});

		// Return the created span
		return span;
	}
}