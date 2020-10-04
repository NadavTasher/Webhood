/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import Path from "path";
import FileSystem from "fs";

// Import utilities
import { Validator } from "../utilities/validator.mjs";

/**
 * A simple interface for reading and writing database tables.
 */
export class Table {

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
            if (Validator.valid(id, "id"))
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
}