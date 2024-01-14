class API {
	static async call(action, parameters = {}) {
		// Execute request using fetch
		const response = await fetch(`api/${action}`, {
			method: "post",
			body: JSON.stringify(parameters),
		});

		// Check response status code
		if (response.status !== 200) throw new Error(await response.text());

		// Return the result
		return await response.json();
	}
}
