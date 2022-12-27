class API {
	static async call(action = null, parameters = null) {
		// Execute request using fetch
		const response = await fetch(`api/${action}`, {
			method: "post",
			body: JSON.stringify(parameters),
		});

		// Parse response content as JSON
		const result = await response.json();

		// Validate structure of result
		if (result.status === undefined || result.result === undefined) throw new Error("API response malformed");

		// Make sure the status is good
		if (!result.status) throw new Error(result.result);

		// Return the result
		return result.result;
	}
}
