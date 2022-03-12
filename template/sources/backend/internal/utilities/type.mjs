/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Import string utilities
import { charset } from "./function.mjs";

/**
 * Simple class to validate different types of objects.
 */
export class Type {
	/**
	 * Returns whether a variable is non-null.
	 * @param variable Variable
	 * @returns {Boolean} Is Non-null
	 */
	static isNonnull(variable) {
		// Make sure the variable is not null
		return variable !== null;
	}

	/**
	 * Returns whether a variable is a string.
	 * @param variable Variable
	 * @returns {Boolean} Is a string
	 */
	static isString(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the type is string
		return typeof variable === "string";
	}

	/**
	 * Returns whether a variable is a number.
	 * @param variable Variable
	 * @returns {Boolean} Is a number
	 */
	static isNumber(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the type is number
		return typeof variable === "number";
	}

	/**
	 * Returns whether a variable is a boolean.
	 * @param variable Variable
	 * @returns {Boolean} Is a boolean
	 */
	static isBoolean(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the type is boolean
		return typeof variable === "boolean";
	}

	/**
	 * Returns whether a variable is an array.
	 * @param variable Variable
	 * @returns {Boolean} Is an array
	 */
	static isArray(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is an array
		return Array.isArray(variable);
	}

	/**
	 * Returns whether a variable is an object.
	 * @param variable Variable
	 * @returns {Boolean} Is an object
	 */
	static isObject(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is not an array
		if (Type.isArray(variable))
			return false;

		return typeof variable === "object";
	}

	/**
	 * Returns whether a variable is a function.
	 * @param variable Variable
	 * @returns {Boolean} Is a function
	 */
	static isFunction(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable type is function
		return typeof variable === "function";
	}

	/**
	 * Returns whether a variable is a binary string.
	 * @param variable Variable
	 * @returns {Boolean} Is a binary string
	 */
	static isBinary(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is a string
		if (!Type.isString(variable))
			return false;

		// Make sure the variable matches the charset
		return charset(variable, "01");
	}

	/**
	 * Returns whether a variable is a decimal string.
	 * @param variable Variable
	 * @returns {Boolean} Is a decimal string
	 */
	static isDecimal(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is a string
		if (!Type.isString(variable))
			return false;

		// Make sure the variable matches the charset
		return charset(variable, "0123456789");
	}

	/**
	 * Returns whether a variable is a hexadecimal string.
	 * @param variable Variable
	 * @returns {Boolean} Is a hexadecimal string
	 */
	static isHexadecimal(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is a string
		if (!Type.isString(variable))
			return false;

		// Make sure the variable matches the charset
		return charset(variable, "0123456789abcdef");
	}

	/**
	 * Returns whether a variable is an ID string.
	 * @param variable Variable
	 * @returns {Boolean} Is an ID string
	 */
	static isId(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is a string
		if (!Type.isString(variable))
			return false;

		// Make sure the variable matches the charset
		return charset(variable, "abcdefghijklmnopqrstuvwxyz0123456789");
	}

	/**
	 * Returns whether a variable is a key string.
	 * @param variable Variable
	 * @returns {Boolean} Is a key string
	 */
	static isKey(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is a string
		if (!Type.isString(variable))
			return false;

		// Make sure the variable matches the charset
		return charset(variable, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
	}

	/**
	 * Returns whether a variable is a hash string.
	 * @param variable Variable
	 * @returns {Boolean} Is a hash string
	 */
	static isHash(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is a string
		if (!Type.isString(variable))
			return false;

		// Make sure the variable is hexadecimal
		if (!Type.isHexadecimal(variable))
			return false;

		// Make sure the length of the variable is valid
		return variable.length === 64;
	}

	/**
	 * Returns whether a variable is an email string.
	 * @param variable Variable
	 * @returns {Boolean} Is an email string
	 */
	static isEmail(variable) {
		// Make sure the variable is not null
		if (!Type.isNonnull(variable))
			return false;

		// Make sure the variable is a string
		if (!Type.isString(variable))
			return false;

		// Split the string on the @ mark
		let split = variable.split("@");

		// Make sure there are exactly two parts
		if (split.length !== 2)
			return false;

		// Validate the first part
		let personal = split.shift();

		// Loop over parts split by "."
		for (let part of personal.split(".")) {
			// Make sure the part length if longer then 0
			if (part.length === 0)
				return false;

			// Make sure the part matches the charset
			if (!charset(part, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+/=?^_`{|}~-"))
				return false;
		}

		// Validate the second part
		let domain = split.shift();

		// Loop over parts split by "."
		for (let part of domain.split(".")) {
			// Make sure the part length if longer then 0
			if (part.length === 0)
				return false;

			// Make sure the part matches the charset
			if (!charset(part, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"))
				return false;
		}

		// Passed validation
		return true;
	}
};