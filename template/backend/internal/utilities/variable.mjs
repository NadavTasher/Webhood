/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import general utilities
import Utilities from "./utilities.mjs";

// Common validators
const Validators = {

    // General type validators

    nonnull(variable) {
        // Make sure the variable is not null
        if (variable === null)
            throw new Error(`Variable is null`);

        return true;
    },
    string(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the type is string
        if (typeof variable !== "string")
            throw new Error(`Variable is not a string`);

        return true;
    },
    number(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the type is string
        if (typeof variable !== "number")
            throw new Error(`Variable is not a number`);

        return true;
    },
    boolean(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the type is string
        if (typeof variable !== "boolean")
            throw new Error(`Variable is not a boolean`);

        return true;
    },
    array(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the variable is an array
        if (!Array.isArray(variable))
            throw new Error(`Variable is not an array`);

        return true;
    },
    object(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the variable type is object
        if (typeof variable !== "object")
            throw new Error(`Variable is not an object`);

        // Make sure it is not an array
        if (Array.isArray(variable))
            throw new Error(`Variable is an array`);

        return true;
    },

    // Complex variable validators

    id(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the variable is a string
        Validators.string(variable);

        // Make sure the variable matches the charset
        if (!Utilities.match(variable, "abcdefghijklmnopqrstuvwxyz0123456789"))
            throw new Error(`Variable is not a valid ID`);

        return true;
    },
    key(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the variable is a string
        Validators.string(variable);

        // Make sure the variable matches the charset
        if (!Utilities.match(variable, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"))
            throw new Error(`Variable is not a valid key`);

        return true;
    },
    hash(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the variable is a string
        Validators.string(variable);

        // Make sure the variable is hexadecimal
        Validators.hexadecimal(variable);

        // Make sure the length of the variable is valid
        if (variable.length !== 64)
            throw new Error(`Variable is not a valid hash`);

        return true;
    },
    hexadecimal(variable) {
        // Make sure the variable is not null
        Validators.nonnull(variable);

        // Make sure the variable is a string
        Validators.string(variable);

        // Make sure the variable matches the charset
        if (!Utilities.match(variable, "0123456789abcdef"))
            throw new Error(`Variable is not a valid hexadecimal`);

        return true;
    }
};

/**
* This class contains variable validation utility functions.
*/
export default class Variable {

    /**
     * Checks whether a variable is valid using a validator function or a common validator name.
     * @param variable Variable
     * @param validator Validator
     * @return {boolean} Is valid
     */
    static valid(variable, validator = "nonnull") {
        // Try validating the variable
        try {
            // Validate using the validate function
            this.validate(variable, validator);

            // Return success
            return true;
        } catch (e) {
            // Return failure
            return false;
        }
    }

    /**
     * Validates a variable using a validator function or a common validator name.
     * @param variable Variable
     * @param validator Validator
     * @throws {Error} Validation error
     */
    static validate(variable, validator = "nonnull") {
        // Check whether the validator is a function or a string
        if (typeof validator === "function") {
            // Execute the validator
            let result = validator(variable);

            // Check result
            if (result === false)
                throw new Error(`Failed to validate variable`);
        } else {
            // Make sure the validator type is string
            if (!Validators.string(validator))
                throw new Error(`Invalid validator type`);

            // Make sure the validator exists
            if (!Validators.hasOwnProperty(validator))
                throw new Error(`Missing "${validator}" validator`);

            // Validate using the validator
            this.validate(variable, Validators[validator]);
        }
    }
}