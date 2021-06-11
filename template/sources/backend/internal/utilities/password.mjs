/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import charset class for randoms, hash for hashes
import { Hash } from "./hash.mjs";
import { Charset } from "./charset.mjs";

/**
 * A simple interface for validating and creating password bundles.
 */
export class Password {

	/**
	 * Creates a password token.
	 * @param password Password
	 * @return {string} Password token
	 */
	static create(password) {
		// Create the salt
		const salt = Charset.random(16);
		// Stringify, encode and return
		return Buffer.from(JSON.stringify([salt, Hash.hash(password + salt)])).toString("base64");
	}

	/**
	 * Checks a password using a password token.
	 * @param password Password
	 * @param token Password token
	 */
	static check(password, token) {
		// Parse the token object
		const array = JSON.parse(Buffer.from(token, "base64").toString());
		// Make sure the length of the array is 2
		if (array.length !== 2)
			throw new Error(`Invalid password token`);
		// Validate password
		return Hash.hash(password + array[0]) === array[1];
	}
};