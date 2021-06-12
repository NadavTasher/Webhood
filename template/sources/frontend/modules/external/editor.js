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
	static render(view, defaults = {
		"color": "#9cdcfe",
		"function": () => { }
	}, comments = {
		"color": "669352",
		"prefix": "#",
		"function": () => {}
	}, keywords = {}, separators = ["\\s", "\\."]) {
		// Validate parameters
		Validator.validate(defaults, {
			"color": "string",
			"function": "function"
		});

		Validator.validate(comments, {
			"color": "string",
			"prefix": "string",
			"function": "function"
		});

		// Find view in page
		view = UI.find(view);

		// Read view text
		const text = UI.read(view);
		const textLines = text.split("\n");

		// Create HTML contents
		let editorElements = [];

		// Loop over each line and parse it
		for (const lineIndex in textLines) {
			// Append new line
			if (editorElements.length > 0) 
				editorElements.push(document.createElement("br"));

			// Append line finder
			const lineFinder = document.createElement("span");
			lineFinder.id = view.id + "-" + lineIndex;
			editorElements.push(lineFinder);

			// Find line text
			const lineText = textLines[lineIndex];

			// Check for comment
			if (lineText.startsWith(comments.prefix)) {
				// Add span to element
				editorElements.push(Editor._span(lineText, comments.color, () => {
					comments.function(lineText, lineIndex, lineText);
				}));
			} else {
				// Parse each word
				const wordArray = lineText.split(new RegExp(`(?=[${separators.join("")}])|(?<=[${separators.join("")}])`));

				// Loop over each word and parse it
				for (const wordText of wordArray) {
					// Load styles
					let properties = defaults;

					// Find proper properties
					for (let type in keywords) {
						if (keywords[type].words.includes(wordText))
							properties = keywords[type].properties;
					}

					// Add spans to element
					editorElements.push(Editor._span(wordText, properties.color, () => {
						properties.function(wordText, lineIndex, lineText);
					}));
				}
			}
		}

		// Clear view of current elements
		UI.clear(view);

		// Append all children to view
		for (const element of editorElements)
			view.appendChild(element);

		// Make the view an editor
		view.setAttribute("editor", "true");
		view.setAttribute("contenteditable", "true");

		// Return lines
		return textLines;
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