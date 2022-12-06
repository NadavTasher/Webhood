class Module {
	static load() {
		return Promise.all(Array.from(arguments).map(Module.module));
	}

	static module(module) {
		// Transform module name to lowercase
		module = module.toLowerCase();

		// Create import promise
		return new Promise((resolve, reject) => {
			// Create a script element
			const element = document.createElement("script");
			element.id = `module:${module}`;
			element.src = `modules/${module}.js`;

			// Check if already exists
			if (document.getElementById(element.id)) {
				resolve(`Module ${module} was already loaded`);
				return;
			}

			// Add success and failure listeners
			element.addEventListener("load", () => {
				resolve(`Module "${module}" was loaded`);
			});
			element.addEventListener("error", () => {
				// Failed loading - remove element
				document.head.removeChild(element);

				// Reject the promise
				reject(`Module "${module}" was not loaded`);
			});

			// Append script to head
			document.head.appendChild(element);
		});
	}

	static resources(module) {
		// Transform module name to lowercase
		module = module.toLowerCase();

		// Create import promise
		return new Promise((resolve, reject) => {
			// Create the resources element
			const element = document.createElement("div");
			element.id = `resources:${module}`;

			// Check if already exists
			if (document.getElementById(element.id)) {
				resolve(`Resources for ${module} are already loaded`);
				return;
			}

			// Try fetching the HTML resource
			fetch(`modules/${module}.html`)
				.then((response) => {
					response
						.text()
						.then((resources) => {
							// Check if already exists
							if (document.getElementById(element.id)) {
								resolve(`Resources for ${module} were loaded already`);
								return;
							}

							// Set the content of the element
							element.innerHTML = resources;

							// Add the element to the head
							document.head.appendChild(element);

							// Resolve the promise
							resolve(`Resources for ${module} were loaded`);
						})
						.catch(reject);
				})
				.catch(reject);
		});
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
