/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import utilities
import { Hash } from "../internal/utilities/hash.mjs";
import { Table } from "../internal/database/database.mjs";
import { Authority } from "../internal/utilities/token.mjs";
import { Utilities } from "../internal/utilities/utilities.mjs";

// Initialize a token issuer instance
const mAuthority = new Authority(process.env.password);

// Initialize the database table
const mTable = new Table("users", {
    name: "string",
    password: {
        hmac: "hash",
        secret: "id"
    }
});

// Export user validator
export function User(token) {
    // Validate using authority
    return mAuthority.validate(token);
}

// Export route
export const Routes = {
    issue: {
        handler: (parameters) => {
            // Generate a user ID
            let id = Hash.hash(parameters.name);

            // Check whether the user exists
            if (mTable.has(id)) {
                // Get user from table
                let user = mTable.get(id);

                // Make sure the password is correct
                if (Hash.hmac(parameters.password, user.password.secret) !== user.password.hmac)
                    throw new Error(`Password is incorrect`);
            } else {
                // Create secret and hmac
                let secret = Utilities.random(64);
                let hmac = Hash.hmac(parameters.password, secret);

                // Set user in table
                mTable.set(id, {
                    name: parameters.name,
                    password: {
                        hmac: hmac,
                        secret: secret
                    }
                });
            }

            // Issue a new token
            return mAuthority.issue(id);
        },
        parameters: {
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
            ]
        }
    },
    validate: {
        handler: (parameters) => {
            // Return the name
            return mAuthority.validate(parameters.token);
        },
        parameters: {
            token: [
                ("string"),
                (token) => {
                    mAuthority.validate(token);
                    return true;
                }
            ]
        }
    }
};