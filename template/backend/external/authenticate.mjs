/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import utilities
import { Hash } from "../internal/utilities/hash.mjs";
import { Table } from "../internal/database/database.mjs";
import { Authority } from "../internal/utilities/token.mjs";
import { Utilities } from "../internal/utilities/utilities.mjs";

// Initialize the database table
const mTable = new Table("users", {
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
const mAuthority = new Authority(process.env.password);

// Create the table of validators
const mValidators = {
    name: [
        ("string"),
        (name) => {
            if (name.length < 4)
                throw new Error(`Name too short`);

            if (name.length > 16)
                throw new Error(`Name too long`);

            return true;
        }
    ],
    password: [
        ("string"),
        (password) => {
            if (password.length < 8)
                throw new Error(`Password too short`);

            if (password.length > 128)
                throw new Error(`Password too long`);

            return true;
        }
    ],
    token: [
        ("string"),
        (token) => {
            mAuthority.validate(token);
            return true;
        }
    ],
};

// Export user validator
export function User(token) {
    // Validate using authority
    return mAuthority.validate(token);
}

// Export route
export const Routes = {
    validate: {
        handler: (parameters) => {
            // Return the name
            return mAuthority.validate(parameters.token);
        },
        parameters: {
            token: mValidators.token
        }
    },
    signUp: {
        handler: (parameters) => {
            // Generate a user ID
            let id = Hash.hash(parameters.name);

            // Make sure the user does not exist
            if (mTable.has(id))
                throw new Error(`User already exists`);

            // Generate values
            let salt = Utilities.random(32);
            let hash = Hash.hash(parameters.password + salt);

            // Write to the database
            mTable.set(id, {
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
            return mAuthority.issue(id);
        },
        parameters: {
            name: mValidators.name,
            password: mValidators.password
        }
    },
    signIn: {
        handler: (parameters) => {
            // Generate a user ID
            let id = Hash.hash(parameters.name);

            // Make sure the user exists
            if (!mTable.has(id))
                throw new Error(`User does not exist`);

            // Read from the database
            let object = mTable.get(id);

            // Check password match
            if (Hash.hash(parameters.password + object.authorization.password.salt) !== object.authorization.password.hash)
                throw new Error(`Incorrect password`);

            // Issue a token and return
            return mAuthority.issue(id);
        },
        parameters: {
            name: mValidators.name,
            password: mValidators.password
        }
    }
};