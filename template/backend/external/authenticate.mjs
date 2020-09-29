/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import utilities
import Table from "../internal/database.mjs";
import Authority from "../internal/token.mjs";
import Utilities from "../internal/utilities.mjs";

// Initialize the database table
const table = new Table("users");

// Initialize a token issuer instance
const authority = new Authority(process.env.password);

// Create the table of validators
const validators = {
    name: (name) => {
        if (typeof name !== "string")
            return false;

        if (name.length < 4)
            throw new Error("Name too short");

        if (name.length > 16)
            throw new Error("Name too long");

        return true;
    },
    password: (password) => {
        if (typeof password !== "string")
            return false;

        if (password.length < 8)
            throw new Error("Password too short");

        if (password.length > 128)
            throw new Error("Password too long");

        return true;
    },
    token: (token) => {
        if (typeof token !== "string")
            return false;

        // Validate token
        authority.validate(token);

        return true;
    }
};

// Export token validator
export function validate(token) {
    // Validate using authority
    return authority.validate(token);
}

// Export route
export default {
    validate: {
        handler: (parameters) => {
            // Return the name
            return authority.validate(parameters.token);
        },
        parameters: {
            token: validators.token
        }
    },
    signUp: {
        handler: (parameters) => {
            // Search for entries with the name
            let entries = table.query("name", parameters.name);

            // Make sure no entries exist
            if (entries.length !== 0)
                throw new Error("User already exists");

            // Create a new entry
            let id = table.insert();

            // Write name
            table.set(id, "name", parameters.name);

            // Generate values
            let salt = Utilities.random(32);
            let hash = Utilities.hash(parameters.password + salt);

            // Update values
            table.set(id, "salt", salt);
            table.set(id, "hash", hash);

            // Return token
            return authority.issue(id);
        },
        parameters: {
            name: validators.name,
            password: validators.password
        }
    },
    signIn: {
        handler: (parameters) => {
            // Search for entries with the name
            let entries = table.query("name", parameters.name);

            // Make sure there are entries
            if (entries.length === 0)
                throw new Error("User does not exist");

            // Read user ID
            let id = entries.shift();

            // Generate values
            let salt = table.get(id, "salt");
            let hash = table.get(id, "hash");

            // Validate hash
            if (Utilities.hash(parameters.password + salt) !== hash)
                throw new Error("Incorrect password");

            // Issue a token and return
            return authority.issue(id);
        },
        parameters: {
            name: validators.name,
            password: validators.password
        }
    }
};