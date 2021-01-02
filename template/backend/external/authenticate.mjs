/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import utilities
import { Hash, Database, Authority, Utilities } from "../internal/utilities.mjs";

// Initialize a token issuer instance
export const Token = new Authority(process.env.password);

// Initialize the database table
export const Users = new Database("users", {
    name: "string",
    password: {
        hmac: "hash",
        secret: "id"
    }
});

// Export routes
export const Routes = {
    authenticate: {
        issue: {
            handler: (parameters) => {
                // Generate a user ID
                let id = Hash.hash(parameters.name);

                // Check whether the user exists
                if (Users.has(id)) {
                    // Get user from table
                    let user = Users.get(id);

                    // Make sure the password is correct
                    if (Hash.hmac(parameters.password, user.password.secret) !== user.password.hmac)
                        throw new Error(`Password is incorrect`);
                } else {
                    // Create secret and hmac
                    let secret = Utilities.random(64);
                    let hmac = Hash.hmac(parameters.password, secret);

                    // Set user in table
                    Users.set(id, {
                        name: parameters.name,
                        password: {
                            hmac: hmac,
                            secret: secret
                        }
                    });
                }

                // Issue a new token
                return Token.issue(id);
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
                return Token.validate(parameters.token);
            },
            parameters: {
                token: [
                    ("string"),
                    (token) => {
                        Token.validate(token);
                        return true;
                    }
                ]
            }
        }
    }
};