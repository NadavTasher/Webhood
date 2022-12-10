class API {
	static call(action = null, parameters = null) {
		return new Promise((resolve, reject) => {
			// Perform the request
			fetch(`api/${action}`, {
				method: "post",
				body: JSON.stringify(parameters),
			}).then((response) => {
				response
					.json()
					.then((result) => {
						// Check the result's integrity
						if (result.hasOwnProperty("status") && result.hasOwnProperty("result")) {
							// Call the callback with the result
							if (result["status"] === true) {
								resolve(result["result"]);
							} else {
								reject(result["result"]);
							}
						} else {
							// Reject with an error
							reject("API response malformed");
						}
					})
					.catch((error) => {
						// Reject with an error
						reject("API response malformed");
					});
			});
		});
	}
}
