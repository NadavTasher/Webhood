/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import types for type support
import { Type } from "./type.mjs";

/**
 * This class contains variable validation utility functions.
 */
export class Validator {

	/**
	 * Checks whether a variable is valid using a validator function, scheme or validator name.
	 * @param variable Variable
	 * @param validator Validator
	 * @return {boolean} Is valid
	 */
	static valid(variable, validator = "nonnull") {
		// Wrap execution with try/catch
		try {
			// Validate using the validation function
			this.validate(variable, validator);

			// Validation passed - return true
			return true;
		} catch {
			// Validation failed - return false
			return false;
		}
	}

	/**
	 * Validates a variable using a validator function, scheme or validator name.
	 * @param variable Variable
	 * @param validator Validator
	 * @throws {Error} Validation error
	 */
	static validate(variable, validator = "nonnull") {

		// Check whether the validator is a function
		if (Type.isFunction(validator)) {
			// Execute the validator
			if (validator(variable) === false)
				throw new Error(`Variable is invalid`);
		}

		// Check whether the validator is a string
		if (Type.isString(validator)) {
			// Create validator name
			let property = `is${validator.charAt(0).toUpperCase() + validator.slice(1).toLowerCase()}`;

			// Make sure the validator exists
			if (!Type.hasOwnProperty(property))
				throw new Error(`Missing "${validator}" validator`);

			// Validate using the validator
			this.validate(variable, Type[property]);
		}

		// Check whether the validator is an array
		if (Type.isArray(validator)) {
			// Loop over validator and individually validate with each item
			for (let item of validator)
				this.validate(variable, item);
		}

		// Check whether the validator is an object (scheme)
		if (Type.isObject(validator)) {

			// Loop over each of the validator's properties and validate them
			for (let property in validator) {
				// Make sure the property is a string
				if (!Type.isString(property))
					throw new Error(`Key is not a valid string`);

				// Check whether the key is optional
				let optional = false;
				while (property.startsWith("?")) {
					property = property.slice(1);
					optional = true;
				}

				// Make sure the property is a valid key
				if (!Type.isKey(property))
					throw new Error(`Key "${property}" is invalid`);

				// Make sure the property exists in the variable
				if (!variable.hasOwnProperty(property) && !optional)
					throw new Error(`Missing "${property}" property`);

				// Validate recursively
				if (variable.hasOwnProperty(property))
					this.validate(variable[property], validator[property]);
			}
		}
	}
};