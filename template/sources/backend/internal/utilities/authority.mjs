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
 * A simple class to represent tokens
 */
export class Token {

	// Identification properties
	#id = null;
	#hirarchy = null;

	// Token properties
	#name = null;
	#contents = null;

	// Validation properties
	#validity = null;
	#permissions = null;

	/**
	 * Returns the token ID.
	 * @param value Update value
	 * @returns {String} Token ID
	 */
	id(value = null) {
		// Check whetehr value is null
		if (value === null)
			return this.#id;

		// Validate new name
		Validator.validate(value, "string");

		// Set name
		this.#id = value;
		return value;
	}

	/**
	 * Returns the token name.
	 * @param value Update value
	 * @returns {String} Token name
	 */
	name(value = null) {
		// Check whetehr value is null
		if (value === null)
			return this.#name;

		// Validate new name
		Validator.validate(value, "string");

		// Set name
		this.#name = value;
		return value;
	}

	/**
	 * Returns the token contents.
	 * @param value Update value
	 * @returns {Object} Token contents
	 */
	contents(value = null) {
		// Check whetehr value is null
		if (value === null)
			return this.#contents;

		// Validate new contents
		Validator.validate(value, "object");

		// Set contents
		this.#contents = value;
		return value;
	}

	/**
	 * Returns the token hirarchy.
	 * @param value Update value
	 * @returns {Array} Token hirarchy
	 */
	hirarchy(value = null) {
		// Check whetehr value is null
		if (value === null)
			return this.#hirarchy;

		// Validate new permissions
		Validator.validate(value, "array");

		// Set permissions
		this.#hirarchy = value;
		return value;
	}

	/**
	 * Returns the token permissions.
	 * @param value Update value
	 * @returns {Array} Token permissions
	 */
	permissions(value = null) {
		// Check whetehr value is null
		if (value === null)
			return this.#permissions;

		// Validate new permissions
		Validator.validate(value, "array");

		// Set permissions
		this.#permissions = value;
		return value;
	}

	/**
	 * Returns the token validity.
	 * @param value Update value
	 * @returns {Number} Token validity
	 */
	validity(value = null) {
		// Check whetehr value is null
		if (value === null)
			return this.#validity;

		// Validate new validity
		Validator.validate(value, "number");

		// Set validity
		this.#validity = value;
		return value;
	}

	/**
	 * Checks whether the token has requested permissions.
	 * @param object Permission string or Permissions array
	 * @returns {Boolean} Has permissions
	 */
	has(object = []) {
		// Check object type
		if (Validator.valid(object, "string")) {
			// Check permission existence
			return this.#permissions.includes(object);
		} else {
			if (Validator.valid(object, "array")) {
				// Validate all permissions
				for (let permission of object)
					if (!this.has(permission))
						return false;
				return true;
			}
		}
		// Default to false
		return false;
	}

	/**
	 * Converts a token object to a JSON object.
	 * @param token Token object
	 * @returns {Object} JSON object
	 */
	static toObject(token) {
		// Assemble token object
		return {
			data: {
				name: token.name(),
				contents: token.contents(),
			},
			validation: {
				validity: token.validity(),
				permissions: token.permissions(),
			},
			identification: {
				id: token.id(),
				hirarchy: token.hirarchy()
			},
		};
	}

	/**
	 * Converts a JSON object to a token object.
	 * @param object JSON object
	 * @returns {Token} Token object
	 */
	static fromObject(object) {
		// Create new token
		const token = new Token();

		// Validate object
		Validator.validate(object, {
			data: {
				name: "string",
				contents: "object",
			},
			validation: {
				validity: "number",
				permissions: "array",
			},
			identification: {
				id: "string",
				hirarchy: "array",
			},
		});

		// Set properties
		token.name(object.data.name);
		token.contents(object.data.contents);

		token.id(object.identification.id);
		token.hirarchy(object.identification.hirarchy)

		token.validity(object.validation.validity);
		token.permissions(object.validation.permissions);

		// Return token
		return token;
	}
};

/**
 * A simple permission manager for issuing and validating user access rights.
 */
export class Authority {

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
	issue(name = "Default", contents = {}, permissions = [], validity = (new Date().getTime() + 60 * 60 * 24 * 365 * 1000), issuer = null) {
		// Create token object
		const token = new Token();

		// Set properties
		token.id(Charset.random(10));
		token.hirarchy([]);

		token.name(name);
		token.contents(contents);

		token.validity(validity);
		token.permissions(permissions);

		// Validate issuer
		if (issuer !== null) {
			// Validate parent token
			const parent = this.validate(issuer, ["issue", permissions], validity);

			// Add token IDs
			token.hirarchy([...parent.hirarchy(), parent.id()]);
		}

		// Create the token
		const string = Buffer.from(JSON.stringify(Token.toObject(token))).toString("base64");
		const signature = Hash.hmac(string, this.#secret, "base64");

		// Join strings and return
		return [string, signature].join(DELIMITER);
	}

	/**
	 * Validates a token.
	 * @param string Token string
	 * @param permissions Array of minimal validation permissions
	 * @param time Time to validate the token against
	 * @return {Token} Token object
	 */
	validate(string, permissions = [], time = new Date().getTime()) {
		// Decompile the token into an array
		const parts = string.split(DELIMITER);

		// Make sure there are exactly 2 parts
		if (parts.length !== 2)
			throw new Error(`Invalid token structure`);

		// Make sure the signature is valid
		if (Hash.hmac(parts[0], this.#secret, "base64") !== parts[1])
			throw new Error(`Invalid token signature`);

		// Parse the token string as Base64 then as JSON
		const token = Token.fromObject(JSON.parse(Buffer.from(parts[0], "base64").toString()));

		// Make sure the token is still valid
		if (time > token.validity())
			throw new Error(`Invalid token timestamp`);

		// Validate permissions
		if (!token.has(permissions))
			throw new Error(`Missing minimal permissions`);

		// Return the token
		return token;
	}
};