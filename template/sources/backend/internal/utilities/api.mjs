/**
 * Copyright (c) 2022 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Import HTTP modules
import HTTP from "http";
import HTTPS from "https";

/**
 * A simple API calling class.
 */
export class API {
	/**
	 * Sends an API call.
	 * @param route Route (API)
	 * @param action Action (Function)
	 * @param parameters Parameters (Arguments)
	 * @param location Location (URL)
	 * @return {Promise} Calling promise
	 */
	static call(route, action, parameters, location = "http://localhost") {
		return new Promise((resolve, reject) => {
			// Define the procotol
			const [protocol, host] = location.split("//", 2);

			// Store the type to use (HTTP by default)
			let type = HTTP;

			// Choose module to use
			if (protocol === "http:")
				type = HTTP;
			else if (protocol === "https:")
				type = HTTPS;

			// Perform the request
			const request = type.request(
				{
					// The location of the API
					host: host,
					// The protocol of the API
					protocol: protocol,
					// The route of the API
					path: `/api/${route}/${action}`,
					// The method of the API
					method: 'POST',
				},
				(response) => {
					// Handle the response
					if (response.statusCode !== 200) {
						// Reject with an error
						reject("API response malformed");
						return;
					}

					// Read the response
					const buffer = [];
					response.on("data", (chunk) => {
						// Push chunk to the buffer
						buffer.push(chunk);
					});
					response.on("end", () => {
						// Assemble the response
						try {
							// Assemble buffer and parse as JSON
							const result = JSON.parse(Buffer.concat(buffer).toString());

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
						} catch (error) {
							// Reject with an error
							reject("API response malformed");
						}
					});
				}
			);

			// Add error listener
			request.on("error", (error) => {
				// Reject with an error
				reject("API request failed");
			});

			// Add timeout listener
			request.on("timeout", () => {
				// Reject with an error
				reject("API request timed out");
			});

			// Write request data
			request.write(JSON.stringify(parameters));

			// End the request
			request.end();
		});
	}
};