async function call(action, parameters = {}) {
	// Execute request using fetch
	const response = await fetch(`/api/${action}`, {
		method: "POST",
		body: JSON.stringify(parameters),
		headers: {
			"Content-Type": "application/json",
		},
	});

	// Check response status code
	if (response.status !== 200) throw new Error(await response.text());

	// Return the result
	return await response.json();
}

function socket(action, callback) {
	// Create websocket object using current location
	const object = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + action);

	// Add the on-message event listener
	object.onmessage = (event) => {
		// Call the callback with the data and the object
		callback(event.data, object);
	};

	// Return the object
	return object;
}
