class Module {
    static load() {
        // Return a multi-promise
        return Promise.all(
            // For each argument (module name) in the arguments array (arguments passed to function)
            Array.from(arguments).map(Module.script)
        );
    }

	static locate(module) {
        // Initialize name & default sources
        let name = module.toLowerCase();
        let repository = "internal";

        // Slice name and look for repository
        const slices = name.split(":");

        // Make sure there are exactly two slices
        if (slices.length === 2) {
            name = slices.pop();
            repository = slices.pop();
        }

        // Query repository element
        const element = document.querySelector(`meta[name="repository-${repository}"]`);

        // Make sure repository exists
        if (element !== null)
            return `${element.content}/${name}`;

        // Return null
        return null;
    }

	static script(module) {
		// Create import promise
		return new Promise((resolve, reject) => {
			// Transform module name to lowercase
			module = module.toLowerCase();

			// Create module element name
			const id = `module:${module}`;

			// Check if already exists
			if (document.getElementById(id)) {
				resolve(`Module ${module} was already loaded`);
				return;
			}

			// Make sure module is located
			if (Module.locate(module) === null) {
				reject(`Module "${module}" was not located`);
				return;
			}

			// Create a script tag
			const element = document.createElement("script");

			// Prepare the script tag
			element.id = id;
			element.src = `${Module.locate(module)}.js`;

			// Add success and failure listeners
			element.addEventListener("load", () => {
				resolve(`Module "${module}" was loaded`);
			});
			element.addEventListener("error", () => {
				document.head.removeChild(element);
				reject(`Module "${module}" was not loaded`);
			});

			// Append script to head
			document.head.appendChild(element);
		});
	}

	static resources(module) {
		return new Promise((resolve, reject) => {
			// Transform module name to lowercase
			module = module.toLowerCase();

			// Create module element name
			const id = `module-html:${module}`;

			// Check if already exists
			if (document.getElementById(id)) {
				resolve(`Resources for ${module} are already loaded`);
				return;
			}

			// Try fetching the HTML resource
			fetch(`${Module.locate(module)}.html`).then(
				(response) => {
					response.text().then(
						(html) => {
							// Check if already exists
							if (document.getElementById(id)) {
								resolve(`Resources for ${module} were loaded already`);
								return;
							}

							// Append the HTML to the head
							document.head.innerHTML += html;

							// Create the element marker
							const element = document.createElement("meta");
							element.id = id;

							// Add the element to the head
							document.head.appendChild(element);

							// Resolve the promise
							resolve(`Resources for ${module} were loaded`);
						}
					).catch(reject);
				}
			).catch(reject);
		});
	}
}

// Lock the viewport height to prevent keyboard resizes
window.addEventListener("load", function () {
    // Query viewport element
    let element = document.querySelector(`meta[name="viewport"]`);
    
    // Make sure viewport exists
    if (element !== null)
        // Update viewport height
        element.content = element.content.replace("device-height", Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
});