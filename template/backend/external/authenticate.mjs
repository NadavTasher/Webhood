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
            // Generate a table entry
            let entry = table.entry(parameters.name);

            // Make sure the user does not exist
            if (entry.exists())
                throw new Error("User already exists");

            // Insert the entry
            entry.insert();

            // Generate values
            let salt = Utilities.random(32);
            let hash = Utilities.hash(parameters.password + salt);

            // Update values
            entry.set("salt", salt);
            entry.set("hash", hash);

            // Return token
            return authority.issue(parameters.name);
        },
        parameters: {
            name: validators.name,
            password: validators.password
        }
    },
    signIn: {
        handler: (parameters) => {
            // Generate a table entry
            let entry = table.entry(parameters.name);

            // Make sure the user does not exist
            if (!entry.exists())
                throw new Error("User does not exist");

            // Generate values
            let salt = entry.get("salt");
            let hash = entry.get("hash");

            // Validate hash
            if (Utilities.hash(parameters.password + salt) !== hash)
                throw new Error("Incorrect password");

            // Issue a token and return
            return authority.issue(parameters.name);
        },
        parameters: {
            name: validators.name,
            password: validators.password
        }
    }
};