/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import Crypto from "crypto";
import FileSystem from "fs";

/**
 * This class contains utility functions.
 */
export default class Utilities {

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

    /**
     * Checks whether a path exists.
     * @param path Path
     * @return {boolean} Exists
     */
    static exists(path) {
        // Check whether the path exists
        return FileSystem.existsSync(path);
    }

    /**
     * Reads a file and parses it as JSON.
     * @param path Path
     * @return {*} Value
     */
    static read(path) {
        // Make sure the file exists
        if (this.exists(path)) {
            // Read the file and parse as JSON
            try {
                // Read data from file
                let data = FileSystem.readFileSync(path);

                // Parse data as JSON
                let json = JSON.parse(data);

                // Return JSON
                return json;
            } catch (e) {
                // Ignore errors, let function return null
            }
        }

        // Return null as fallback
        return null;
    }

    /**
     * Writes a file with data encoded as JSON.
     * @param path Path
     * @param value Value
     * @return {boolean} Status
     */
    static write(path, value) {
        // Check whether the value is null
        if (value === null) {
            // Remove the file
            FileSystem.unlinkSync(path);
        } else {
            // Try encoding and writing the file
            try {
                // Encode the data as JSON
                let json = JSON.stringify(value);

                // Write the data to file
                FileSystem.writeFileSync(path, json);
            } catch (e) {
                // Return false (failure)
                return false;
            }
        }

        // Return true (success)
        return true;
    }
}