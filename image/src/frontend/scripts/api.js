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
