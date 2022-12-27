class Module {
	static load() {
		return Promise.all(Array.from(arguments).map(Module.module));
	}

	static script(name) {
		// Transform module name to lowercase
		name = name.toLowerCase();

		return new Promise((resolve, reject) => {
			// Create a script element
			const element = document.createElement("script");
			element.id = `script:${name}`;
			element.src = `modules/${name}.js`;

			// Make sure script is not already loaded
			if (document.getElementById(element.id)) {
				resolve(`Script for ${name} is already loaded`);
				return;
			}

			// Add success and failure listeners
			element.addEventListener("load", () => {
				resolve(`Script for ${name} was loaded`);
			});
			element.addEventListener("error", () => {
				// Failed loading - remove element
				document.head.removeChild(element);

				// Reject the promise
				reject(`Script for ${name} was not loaded`);
			});

			// Append module to head
			document.head.appendChild(element);
		});
	}

	static async module(name) {
		// Transform module name to lowercase
		name = name.toLowerCase();

		// Create the resources element
		const element = document.createElement("div");
		element.id = `resources:${name}`;

		// Check if already exists
		if (document.getElementById(element.id)) {
			return `Module ${name} is already loaded`;
		}

		// Try fetching the HTML resource
		const response = await fetch(`modules/${name}.html`);
		const resources = await response.text();

		// Check if already exists
		if (document.getElementById(element.id)) {
			return `Module ${name} was loaded already`;
		}

		// Set the content of the element
		element.innerHTML = resources;

		// Load script before adding resources
		await Module.script(name);

		// Append module to head
		document.head.appendChild(element);
	}
}

// Lock the viewport height to prevent keyboard resizes
window.addEventListener("load", function () {
	// Query viewport element
	const element = document.querySelector(`meta[name="viewport"]`);

	// Make sure viewport exists
	if (element !== null)
		// Update viewport height
		element.content = element.content.replace("device-height", Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
});
