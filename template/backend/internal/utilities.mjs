/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import Crypto from "crypto";

// Initialize the random constants

const RANDOM_CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Generates random strings.
 * @param length Length
 * @return {string} Random string
 */
export function random(length = 0) {
    // Make sure the requested length is longer then 0
    if (length === 0)
        return "";

    // Return a random charset character and recurse
    return RANDOM_CHARSET[Math.floor(Math.random() * RANDOM_CHARSET.length)] + random(length - 1);
}

// Initialize the token constants

const TOKEN_DELIMITER = ":";
const TOKEN_SECRET = process.env.secret;

const TOKEN_CONTENT_KEY = "content";
const TOKEN_VALIDITY_KEY = "validity";

const TOKEN_CONTENT_DEFAULT = null;
const TOKEN_VALIDITY_DEFAULT = (60 * 60 * 24 * 365) * 1000;

/**
 * Issues a token.
 * @param content Contents
 * @param validity Validity
 * @return {string} Token
 */
export function issue(content = TOKEN_CONTENT_DEFAULT, validity = TOKEN_VALIDITY_DEFAULT) {
    // Create the token object
    let tokenObject = {
        [TOKEN_CONTENT_KEY]: content,
        [TOKEN_VALIDITY_KEY]: new Date().getTime() + validity
    };

    // Encode the token object as JSON then as a Base64 string
    let tokenString = Buffer.from(JSON.stringify(tokenObject)).toString("base64");

    // Create an HMAC for the token then encode it as a Base64 string
    let tokenHMAC = Crypto.createHmac("sha256", TOKEN_SECRET).update(tokenString).digest("base64");

    // Create an array with the parts of the token
    let tokenSlices = [tokenString, tokenHMAC];

    // Compile the parts into a single string and return it
    return tokenSlices.join(TOKEN_DELIMITER);
}

/**
 * Validates a token.
 * @param token Token
 * @return {*} Content
 */
export function validate(token) {
    // Decompile the token into an array
    let tokenSlices = token.split(TOKEN_DELIMITER);

    // Make sure there are exactly 2 parts
    if (tokenSlices.length !== 2)
        throw new Error("Invalid token structure");

    let tokenString = tokenSlices.shift();
    let tokenHMAC = tokenSlices.shift();

    // Make sure the signature is valid
    if (Crypto.createHmac("sha256", TOKEN_SECRET).update(tokenString).digest("base64") !== tokenHMAC)
        throw new Error("Invalid token signature");

    // Parse the token string as Base64 then as JSON
    let tokenObject = JSON.parse(Buffer.from(tokenString, "base64").toString());

    // Make sure the token is still valid
    if (new Date().getTime() > tokenObject[TOKEN_VALIDITY_KEY])
        throw new Error("Invalid token validity");

    // Return the content
    return tokenObject[TOKEN_CONTENT_KEY];
}