/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Extend classes
Date.prototype.getEpochDay = function () { return Math.floor(this.getTime() / (1000 * 60 * 60 * 24)); };

class Module {

    /**
     * Loads a module.
     * @param module Module
     */
    static load(module) {
        // Return a multi-promise
        return Promise.all(
            // For each argument (module name) in the arguments array (arguments passed to function)
            Array.from(arguments).map((argument) =>
                // Create a new import promise
                new Promise((resolve, reject) => {
                    // Transform module name
                    argument = argument.toLowerCase();

                    // Create a script tag
                    let scriptElement = document.createElement("script");

                    // Prepare the script tag
                    scriptElement.id = "module:" + argument;
                    scriptElement.src = this.locate(argument);

                    // Hook to state handlers
                    scriptElement.addEventListener("load", () => {
                        // Resolve promise
                        resolve(`Module "${argument}" was loaded`);
                    });

                    scriptElement.addEventListener("error", () => {
                        // Remove element
                        document.head.removeChild(scriptElement);

                        // Reject promise
                        reject(`Module "${argument}" was not loaded`);
                    });

                    // Make sure the script is not loaded already
                    if (document.getElementById(scriptElement.id)) {
                        // Resolve promise
                        resolve(`Module "${argument}" was already loaded`);

                        // Finish execution
                        return;
                    }
                    // Append script to head
                    document.head.appendChild(scriptElement);
                })
            )
        );
    }

    /**
     * Locates a module's script.
     * @param module Module
     */
    static locate(module) {
        // Initialize name & default sources
        let name = module.toLowerCase();
        let repository = "internal";

        // Slice name and look for repository
        let slices = name.split(":");

        // Make sure there are exactly two slices
        if (slices.length === 2) {
            // Update name
            name = slices.pop();
            // Update sources
            repository = slices.pop();
        }

        // Query repository element
        let element = document.querySelector(`meta[name="repository-${repository}"]`);

        // Make sure repository exists
        if (element !== null)
            return `${element.content}/${name}.js`;

        // Return null
        return null;
    }
}

/**
 * This class contains general utility functions.
 */
class Charset {

    /**
     * Generates random strings.
     * @param length Length
     * @param charset Charset
     * @return {string} Random string
     */
    static random(length = 0, charset = "abcdefghijklmnopqrstuvwxyz0123456789") {
        // Make sure the requested length is longer then 0
        if (length === 0)
            return "";

        // Return a random charset character and recurse
        return charset[Math.floor(Math.random() * charset.length)] + this.random(length - 1, charset);
    }

    /**
     * Checks whether a string matches a given charset.
     * @param string String
     * @param charset Charset
     */
    static match(string, charset = "abcdefghijklmnopqrstuvwxyz0123456789") {
        // Loop over all characters in the string
        for (let char of string)
            // Return false if the charset does not contain the char
            if (!charset.includes(char))
                return false;

        return true;
    }
};

/**
 * Simple class to validate different types of objects.
 */
class Type {

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
		return Charset.match(variable, "01");
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
		return Charset.match(variable, "0123456789");
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
		return Charset.match(variable, "0123456789abcdef");
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
		return Charset.match(variable, "abcdefghijklmnopqrstuvwxyz0123456789");
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
		return Charset.match(variable, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
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
			if (!Charset.match(part, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+/=?^_`{|}~-"))
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
			if (!Charset.match(part, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"))
				return false;
		}

		// Passed validation
		return true;
	}
}

/**
 * This class contains variable validation utility functions.
 */
class Validator {

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
}

// Lock the viewport height to prevent keyboard resizes
window.addEventListener("load", function () {
    // Query viewport element
    let element = document.querySelector(`meta[name="viewport"]`);
    
    // Make sure viewport exists
    if (element !== null)
        // Update viewport height
        element.content = element.content.replace("device-height", Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
});