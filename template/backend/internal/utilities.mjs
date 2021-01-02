/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import Path from "path";
import Crypto from "crypto";
import FileSystem from "fs";

// Define constants
const DELIMITER = ":";
const CONTENT_KEY = "content";
const VALIDITY_KEY = "validity";
const CONTENT_DEFAULT = null;
const VALIDITY_DEFAULT = (60 * 60 * 24 * 365) * 1000;

/**
 * This class contains general utility functions.
 */
export class Utilities {

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
}

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
        if (Validator.isFunction(validator)) {
            // Execute the validator
            if (validator(variable) === false)
                throw new Error(`Variable is invalid`);
        }

        // Check whether the validator is a string
        if (Validator.isString(validator)) {
            // Create validator name
            let property = `is${validator.charAt(0).toUpperCase() + validator.slice(1).toLowerCase()}`;

            // Make sure the validator exists
            if (!Validator.hasOwnProperty(property))
                throw new Error(`Missing "${validator}" validator`);

            // Validate using the validator
            this.validate(variable, Validator[property]);
        }

        // Check whether the validator is an array
        if (Validator.isArray(validator)) {
            // Loop over validator and individually validate with each item
            for (let item of validator)
                this.validate(variable, item);
        }

        // Check whether the validator is an object (scheme)
        if (Validator.isObject(validator)) {
            // Make sure the variable is an object
            if (!Validator.isObject(variable))
                throw new Error(`Variable is not an object`);

            // Loop over each of the validator's properties and validate them
            for (let property in validator) {
                // Make sure the property is a valid key
                if (!Validator.isKey(property))
                    throw new Error(`Key "${property}" is invalid`);

                // Make sure the property exists in the variable
                if (!variable.hasOwnProperty(property))
                    throw new Error(`Missing "${property}" property`);

                // Validate recursively
                this.validate(variable[property], validator[property]);
            }
        }
    }

    // Type validators

    static isNonnull(variable) {
        // Make sure the variable is not null
        return variable !== null;
    }

    static isString(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the type is string
        return typeof variable === "string";
    }

    static isNumber(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the type is number
        return typeof variable === "number";
    }

    static isBoolean(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the type is boolean
        return typeof variable === "boolean";
    }

    static isArray(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is an array
        return Array.isArray(variable);
    }

    static isObject(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is not an array
        if (Validator.isArray(variable))
            return false;

        return typeof variable === "object";
    }

    static isFunction(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable type is function
        return typeof variable === "function";
    }

    static isBinary(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is a string
        if (!Validator.isString(variable))
            return false;

        // Make sure the variable matches the charset
        return Utilities.match(variable, "01");
    }

    static isDecimal(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is a string
        if (!Validator.isString(variable))
            return false;

        // Make sure the variable matches the charset
        return Utilities.match(variable, "0123456789");
    }

    static isHexadecimal(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is a string
        if (!Validator.isString(variable))
            return false;

        // Make sure the variable matches the charset
        return Utilities.match(variable, "0123456789abcdef");
    }

    static isId(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is a string
        if (!Validator.isString(variable))
            return false;

        // Make sure the variable matches the charset
        return Utilities.match(variable, "abcdefghijklmnopqrstuvwxyz0123456789");
    }

    static isKey(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is a string
        if (!Validator.isString(variable))
            return false;

        // Make sure the variable matches the charset
        return Utilities.match(variable, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    static isHash(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is a string
        if (!Validator.isString(variable))
            return false;

        // Make sure the variable is hexadecimal
        if (!Validator.isHexadecimal(variable))
            return false;

        // Make sure the length of the variable is valid
        return variable.length === 64;
    }

    static isEmail(variable) {
        // Make sure the variable is not null
        if (!Validator.isNonnull(variable))
            return false;

        // Make sure the variable is a string
        if (!Validator.isString(variable))
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
            if (!Utilities.match(part, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+/=?^_`{|}~-"))
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
            if (!Utilities.match(part, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"))
                return false;
        }

        // Passed validation
        return true;
    }
};

/**
 * This class contains hashing utility functions.
 */
export class Hash {

    /**
     * Hashes a given message.
     * @param message Message
     * @param output Output encoding
     * @return {string} Hash
     */
    static hash(message, output = "hex") {
        return Crypto.createHash("sha256").update(message).digest(output);
    }

    /**
     * HMACs a given message.
     * @param message Message
     * @param password Password (Secret)
     * @param output Output encoding
     * @return {string} HMAC
     */
    static hmac(message, password, output = "hex") {
        return Crypto.createHmac("sha256", password).update(message).digest(output);
    }
};

/**
 * A simple interface for issuing and validating tokens.
 */
export class Authority {

    // Initialize private class members
    #password = null;

    /**
     * Creates a new token instance.
     * @param password Password
     */
    constructor(password) {
        // Set the password
        this.#password = password;
    }

    /**
     * Issues a token.
     * @param content Contents
     * @param validity Validity
     * @return {string} Token
     */
    issue(content = CONTENT_DEFAULT, validity = VALIDITY_DEFAULT) {
        // Create the token object
        let tokenObject = {
            [CONTENT_KEY]: content,
            [VALIDITY_KEY]: new Date().getTime() + validity
        };

        // Encode the token object as JSON then as a Base64 string
        let tokenString = Buffer.from(JSON.stringify(tokenObject)).toString("base64");

        // Create an HMAC for the token then encode it as a Base64 string
        let tokenHMAC = Hash.hmac(tokenString, this.#password, "base64");

        // Create an array with the parts of the token
        let tokenSlices = [tokenString, tokenHMAC];

        // Compile the parts into a single string and return it
        return tokenSlices.join(DELIMITER);
    }

    /**
     * Validates a token.
     * @param token Token
     * @return {*} Content
     */
    validate(token) {
        // Decompile the token into an array
        let tokenSlices = token.split(DELIMITER);

        // Make sure there are exactly 2 parts
        if (tokenSlices.length !== 2)
            throw new Error(`Invalid token structure`);

        let tokenString = tokenSlices.shift();
        let tokenHMAC = tokenSlices.shift();

        // Make sure the signature is valid
        if (Hash.hmac(tokenString, this.#password, "base64") !== tokenHMAC)
            throw new Error(`Invalid token signature`);

        // Parse the token string as Base64 then as JSON
        let tokenObject = JSON.parse(Buffer.from(tokenString, "base64").toString());

        // Make sure the token is still valid
        if (new Date().getTime() > tokenObject[VALIDITY_KEY])
            throw new Error(`Invalid token validity`);

        // Return the content
        return tokenObject[CONTENT_KEY];
    }
};

/**
 * A simple interface for reading and writing database tables.
 */
export class Database {

    // Initialize root directories
    #root = null;

    // Initialize scheme
    #scheme = null;

    /**
     * Table constructor.
     * @param name Table name
     * @param root Parent directory
     */
    constructor(name, scheme = {}, root = "/opt") {
        // Make sure the name is valid
        Validator.validate(name, "key");

        // Initialize the schema
        this.#scheme = scheme;

        // Initialize the root directory path
        this.#root = Path.join(root, name);

        // Make sure the directory exists
        if (!FileSystem.existsSync(this.#root))
            FileSystem.mkdirSync(this.#root);
    }

    /**
     * Checks whether a database entry exists.
     * @param id ID
     */
    has(id) {
        // Make sure the ID is valid
        Validator.validate(id, "id");

        // Check whether the entry exists
        return FileSystem.existsSync(Path.join(this.#root, id));
    }

    /**
     * Reads an entry from the database.
     * @param id ID
     */
    get(id) {
        // Make sure the ID is valid
        Validator.validate(id, "id");

        // Make sure the entry exists
        if (!this.has(id))
            throw new Error(`Entry does not exists`);

        // Read the entry
        let object = JSON.parse(FileSystem.readFileSync(Path.join(this.#root, id)));

        // Make sure the entry adheres to the scheme
        Validator.validate(object, this.#scheme);

        // Return the entry
        return object;
    }

    /**
     * Writes an entry to the database.
     * @param id ID
     * @param entry Entry
     */
    set(id, entry) {
        // Make sure the ID is valid
        Validator.validate(id, "id");

        // Make sure the entry adheres to the scheme
        Validator.validate(entry, this.#scheme);

        // Read the entry
        FileSystem.writeFileSync(Path.join(this.#root, id), JSON.stringify(entry));
    }

    /**
     * Returns a list with all entry IDs.
     */
    ids() {
        // Initialize a list which will be populated with entry IDs
        let ids = [];

        // List all files in the database
        let files = FileSystem.readdirSync(this.#root);

        // Loop over files to make sure they all have valid IDs
        for (let file of files) {
            // Make sure the ID is valid
            if (Validator.valid(file, "id"))
                // Append to list
                ids.push(file);
        }

        // Return ID list
        return ids;
    }

    /**
     * Returns an object with all entries.
     */
    entries() {
        // Initialize a list which will be populated with entry IDs
        let entries = {};

        // List all files in the database
        let files = FileSystem.readdirSync(this.#root);

        // Loop over files to make sure they all have valid IDs
        for (let file of files) {
            // Try reading the entry
            try {
                // Read the entry
                entries[file] = this.get(file);
            } catch (e) {
                // Ignore errors
            }
        }

        // Return entried object
        return entries;
    }
};