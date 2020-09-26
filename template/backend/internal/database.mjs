/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import Path from "path";
import FileSystem from "fs";

// Import utilities
import Utilities from "./utilities.mjs";

/**
 * A simple interface for reading and writing database tables.
 */
export default class Table {

    // Initialize private properties
    #directory = null;

    /**
     * Table constructor.
     * @param name Table name
     * @param root Parent directory
     */
    constructor(name, root = "/opt") {
        // Initialize the table path
        this.#directory = Path.join(root, Utilities.hash(name));

        // Make sure the directory exists
        if (!FileSystem.existsSync(this.#directory))
            FileSystem.mkdirSync(this.#directory);
    }

    /**
     * Returns a valid entry instance for a given entry ID.
     * @param id Entry ID
     * @return {Entry} Entry
     */
    entry(id) {
        // Create the new entry object
        return new Entry(id, this.#directory);
    }
}

/**
 * A simple interface for reading and writing database table entries.
 */
class Entry {

    // Initialize private properties
    #directory = null;

    /**
     * Entry constructor.
     * @param id Entry ID
     * @param root Parent directory
     */
    constructor(id, root = null) {
        // Initialize the entry path
        this.#directory = Path.join(root, Utilities.hash(id));
    }

    /**
     * Reads a value.
     * @param key Key
     * @return {string | number | boolean | array | object | null}
     */
    get(key) {
        // Create the file path
        let path = Path.join(this.#directory, Utilities.hash(key));

        // Make sure the value is set
        if (FileSystem.existsSync(path))
            return JSON.parse(FileSystem.readFileSync(path));

        // Fallback value
        return null;
    }

    /**
     * Writes a value.
     * @param key Key
     * @param value Value
     */
    set(key, value) {
        // Create the file path
        let path = Path.join(this.#directory, Utilities.hash(key));

        // Make sure the value is not null
        if (value === null) {
            // Remove the file
            FileSystem.unlinkSync(path);
        } else {
            // Write the value
            FileSystem.writeFileSync(path, JSON.stringify(value));
        }
    }

    /**
     * Checks whether the entry exists.
     * @return {boolean} Exists
     */
    exists() {
        // Check against filesystem
        return FileSystem.existsSync(this.#directory);
    }

    /**
     * Inserts the entry if it does not exist.
     */
    insert() {
        // Make sure the entry does not exist
        if (this.exists())
            throw new Error(`Entry already exists`);

        FileSystem.mkdirSync(this.#directory);
    }

    /**
     * Removes the entry if it exists.
     */
    remove() {
        // Make sure the entry exists
        if (!this.exists())
            throw new Error(`Entry does not exist`);

        FileSystem.rmdirSync(this.#directory, {
            recursive: true
        });
    }
}