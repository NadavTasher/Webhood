/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import hash for hashing
import { Hash } from "./hash.mjs";
import { Charset } from "./charset.mjs";
import { Validator } from "./validator.mjs";

// Define constants
const DELIMITER = ":";

/**
 * A simple permission manager for issuing and validating user access rights.
 */
export class Token {

	// Initialize private class members
	#secret = null;

	/**
	 * Creates a new token instance.
	 * @param secret Secret
	 */
	constructor(secret) {
		// Set the password
		this.#secret = secret;
	}

	/**
	 * Issue new tokens.
	 * @param information Information object with name, content and permissions 
	 * @param validity Validity time (Time that the token expires on)
	 * @param issuer Issuing token (Parent token or null for root signing)
	 * @returns {String} Token string
	 */
	issue(
		information = {
			name: "Default",
			content: {},
			permissions: []
		},
		validity = new Date().getTime() + ((60 * 60 * 24 * 365) * 1000),
		issuer = null
	) {
		// Validate parameters
		Validator.validate(information, {
			name: "string",
			content: "object",
			permissions: "array"
		});
		Validator.validate(validity, "number");

		// Initialize issuer
		let issuerID = "-- Root --";
		let issuerName = "Server root issuer";

		// Validate issuer
		if (issuer !== null) {
			// Parse issuer object
			const issuerObject = this.validate(issuer, ["issue", ...information.permissions], validity);

			// Update values
			issuerID = issuerObject.id;
			issuerName = issuerObject.name;
		}

		// Generate a token structure
		const tokenObject = {
			issuer: {
				id: issuerID,
				name: issuerName
			},
			token: {
				id: Charset.random(10),
				name: information.name,
				content: information.content,
				permissions: information.permissions
			},
			validity: validity
		};

		// Create the token
		const tokenString = Buffer.from(JSON.stringify(tokenObject)).toString("base64");
		const tokenSignature = Hash.hmac(tokenString, this.#secret, "base64");
		
		// Join strings and return
		return [tokenString, tokenSignature].join(DELIMITER);
	}

	/**
	 * Validates a token.
	 * @param token Token string
	 * @param permissions Array of permissions to validate
	 * @param time Time to validate the token against
	 * @return {*} Token object
	 */
	validate(token, permissions = [], time = new Date().getTime()) {
		// Decompile the token into an array
		const tokenParts = token.split(DELIMITER);

		// Make sure there are exactly 2 parts
		if (tokenParts.length !== 2)
			throw new Error(`Invalid token structure`);

		// Make sure the signature is valid
		if (Hash.hmac(tokenParts[0], this.#secret, "base64") !== tokenParts[1])
			throw new Error(`Invalid token signature`);

		// Parse the token string as Base64 then as JSON
		const tokenObject = JSON.parse(Buffer.from(tokenParts[0], "base64").toString());
		
		// Validate token structure
		Validator.validate(tokenObject, {
			issuer: {
				id: "string",
				name: "string"
			},
			token: {
				id: "string",
				name: "string",
				content: "object",
				permissions: "array"
			},
			validity: "number"
		});

		// Make sure the token is still valid
		if (time > tokenObject.validity)
			throw new Error(`Invalid token timestamp`);

		// Validate permissions
		for (let permission of permissions)
			if (!tokenObject.token.permissions.includes(permission))
				throw new Error(`Missing "${permission}" permission`);

		// Return the token
		return tokenObject.token;
	}
};