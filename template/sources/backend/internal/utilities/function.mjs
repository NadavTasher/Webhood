/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

import Crypto from "crypto";
import Process from "child_process";

/**
 * Hashes a given message.
 * @param message Message
 * @param output Output encoding
 * @return {string} Hashed message
 */
export function hash(message, output = "hex") {
	return Crypto.createHash("sha256").update(message).digest(output);
}

/**
 * HMACs a given message.
 * @param message Message
 * @param password Password (Secret)
 * @param output Output encoding
 * @return {string} HMACed nessage
 */
export function hmac(message, password, output = "hex") {
	return Crypto.createHmac("sha256", password).update(message).digest(output);
}

/**
 * Generates a random string.
 * @param length Length
 * @param charset Charset
 * @return {string} Random string
 */
export function random(length = 0, charset = "abcdefghijklmnopqrstuvwxyz0123456789") {
	// Make sure the requested length is longer then 0
	if (length === 0)
		return "";

	// Return a random charset character and recurse
	return charset[Math.floor(Math.random() * charset.length)] + random(length - 1, charset);
}

/**
 * Checks whether a string is a subset of a charset.
 * @param string String
 * @param charset Charset
 * @return {boolean} True if the string is a subset of the charset, false otherwise
 */
export function charset(string, charset = "abcdefghijklmnopqrstuvwxyz0123456789") {
	// Loop over all characters in the string
	for (const char of string)
		// Return false if the charset does not contain the char
		if (!charset.includes(char))
			return false;

	return true;
}

// Function to join paths
export function join(...paths) {
	return paths.join("/");
};

/**
 * Render a template string.
 * @param string String to render
 * @param parameters Parameters to render
 * @return {string} Rendered string
 */
export function render(string, parameters) {
	// Replace all parameters
	for (const [name, replacement] of Object.entries(parameters)) {
		// Create search value
		const search = `{${name}}`;

		// Replace all instances of the search value
		while (string.includes(search))
			string = string.replace(search, replacement);
	}

	// Return the string
	return string;
};

/**
 * Executes a command asyncronously.
 * @param command Command to execute
 * @return {Promise} Execution promise
 */
export function execute(command) {
	return new Promise((resolve, reject) => {
		try {
			Process.exec(command, (error, stdout, stderr) => {
				if (error) {
					// Reject the promise
					reject(error, stdout, stderr);
				} else {
					// Resolve the promise
					resolve(stdout, stderr);
				}
			});
		} catch (error) {
			// Reject the promise
			reject(error, undefined, undefined);
		}
	});
};

/**
 * Executes a command asynchronously, while rendering sanitized parameters.
 * @param command Command to execute
 * @param parameters Parameters to render
 * @return {Promise} Execution promise
 */
export function evaluate(command, parameters) {
	// Sanitize the parameters
	const sanitized = {};

	// Loop over all parameters
	for (const [name, value] of Object.entries(parameters)) {
		// Cast the value to a string
		const string = value.toString();

		// Sanitize the value
		sanitized[name] = string.replace(/([\&\;\`\'\\\"\|\*\?\~\<\>\^\(\)\[\]\{\}\$\n\r\s\t])/g, "\\$1");
	}

	// Render the command with the parameters and execute
	return execute(render(command, sanitized));
}