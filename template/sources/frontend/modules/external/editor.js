/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Style resources
const resourcesEditor = "PCEtLSBHZW5lcmFsIHN0eWxlIGZvciBlZGl0b3IgZWxlbWVudHMgLS0+CjxzdHlsZT4KCVtlZGl0b3JdIHsKCQlkaXNwbGF5OiBibG9jazsKCQlsaW5lLWhlaWdodDogMTQwJTsKCX0KCglbZWRpdG9yXSA+IHNwYW4gewoJCXdoaXRlLXNwYWNlOiBwcmU7CgkJY3Vyc29yOiBwb2ludGVyOwoJfQo8L3N0eWxlPg==";

// Install resources
document.head.innerHTML += atob(resourcesEditor);

// Load dependencies
Module.load("UI");

class Editor {

	/**
	 * Renders a text editor.
	 * @param {String} view Editor view
	 * @param {Array} lines Text lines
	 * @param {Function} callback Click callback
	 * @param {Object} options Keyword bindings
	 * @returns Lines
	 */
	static render(view, lines, callback = (type, text, index) => { }, options = {
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
		// Find editor view
		view = UI.find(view);

		// Create splitting regex
		const regex = new RegExp(`(?=[${separators}])|(?<=[${separators}])`);

		// Create variable dictionary
		let variables = {};

		// Create HTML contents
		let elements = [];

		// Loop over each line and parse it
		for (const index in lines) {
			// Append new line
			if (elements.length > 0)
				elements.push(document.createElement("br"));

			// Find line text
			const line = lines[index];

			// Check for comment
			if (line.startsWith(options.comments.prefix)) {
				// Add span to element
				elements.push(Editor._span(index, line, options.comments.color, () => {
					callback("comment", line, index);
				}));
			} else {
				// Parse each word
				const words = line.split(regex);

				// Loop over each word and parse it
				for (const word of words) {
					// Add line references
					if (!variables.hasOwnProperty(word))
						variables[word] = [];
					if (!variables[word].includes(index))
						variables[word].push(index);

					// Load styles
					let color;

					// Find proper properties
					for (let type in options.keywords) {
						if (Validator.valid(options.keywords[type], { "color": "string", "values": "array" }))
							if (options.keywords[type].values.includes(word))
								color = options.keywords[type].color;
					}

					// Add spans to element
					elements.push(Editor._span(index, word, color ? color : options.variables.color, () => {
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
		return variables;
	}

	/**
	 * Scrolls the requested line into view.
	 * @param {String} view Editor view
	 * @param {Number} line Line index
	 */
	static scroll(view, line) {
		// Find editor view
		view = UI.find(view);

		// Find element to scroll
		for (const child of view.children) {
			if (child.line == line) {
				child.scrollIntoView();
				return true;
			}
		}

		// Failed to scroll
		return false;
	}

	/**
	 * Creates a span with text, color and click event.
	 * @param {String} line Line index
	 * @param {String} text Text in span
	 * @param {String} color Color in span
	 * @param {Function} click Click function
	 * @returns Span
	 */
	static _span(line, text, color = "var(--text)", click = () => { }) {
		// Create span
		let span = document.createElement("span");

		// Update span with values
		span.innerText = text;
		span.line = line;
		span.style.color = color;

		// Add event listeners
		span.addEventListener("click", () => {
			click();
		});

		// Return the created span
		return span;
	}
}