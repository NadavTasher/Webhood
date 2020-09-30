/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import utilities
import Table from "../internal/database/database.mjs";
import Hash from "../internal/utilities/hash.mjs";
import Authority from "../internal/utilities/token.mjs";
import Utilities from "../internal/utilities/utilities.mjs";

// Initialize the database table
const table = new Table("users", {
    information: {
        name: "string"
    },
    authorization: {
        password: {
            hash: "hash",
            salt: "id"
        }
    }
});

// Initialize a token issuer instance
const authority = new Authority(process.env.password);

// Create the table of validators
const validators = {
    name: [
        "string",
        (name) => {
            if (name.length < 4)
                throw new Error("Name too short");

            if (name.length > 16)
                throw new Error("Name too long");

            return true;
        }
    ],
    password: [
        "string",
        (password) => {
            if (password.length < 8)
                throw new Error("Password too short");

            if (password.length > 128)
                throw new Error("Password too long");

            return true;
        }
    ],
    token: ["string", (token) => {
        authority.validate(token);

        return true;
    }],
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
            // Generate a user ID
            let id = Hash.hash(parameters.name);

            // Make sure the user does not exist
            if (table.has(id))
                throw new Error(`User already exists`);

            // Generate values
            let salt = Utilities.random(32);
            let hash = Hash.hash(parameters.password + salt);

            // Write to the database
            table.set(id, {
                information: {
                    name: parameters.name
                },
                authorization: {
                    password: {
                        hash: hash,
                        salt: salt
                    }
                }
            });

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
            // Generate a user ID
            let id = Hash.hash(parameters.name);

            // Make sure the user exists
            if (!table.has(id))
                throw new Error(`User does not exist`);

            // Read from the database
            let object = table.get(id);

            // Check password match
            if (Hash.hash(parameters.password + object.authorization.password.salt) !== object.authorization.password.hash)
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