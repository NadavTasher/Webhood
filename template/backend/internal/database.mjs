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

    // Initialize root directory variable
    #directory = null;

    /**
     * Table constructor.
     * @param name Table name
     * @param root Parent directory
     */
    constructor(name, root = "/opt") {
        // Initialize the root directory path
        this.#directory = Path.join(root, Utilities.hash(name));

        // Make sure the directory exists
        if (!FileSystem.existsSync(this.#directory))
            FileSystem.mkdirSync(this.#directory);
    }

    /**
     * Inserts a new entry to the table.
     * @return {string} ID
     */
    insert() {
        // Generate a new random ID
        let id = Utilities.random(10);

        // Make sure the entry does not exist
        if (this.exists(id))
            throw new Error(`Entry "${id}" already exists`);

        // Create a new empty entry file
        Utilities.write(this.#entry(id), {});

        // Return the entry ID
        return id;
    }

    /**
     * Removes an entry from the table.
     * @param id ID
     */
    remove(id) {
        // Make sure the entry exists
        if (!this.exists(id))
            throw new Error(`Entry "${id}" does not exist`);

        // Read the entry's file
        let entry = Utilities.read(this.#entry(id));

        // Loop over entry and clear values
        for (let key in entry)
            this.set(id, key, null);

        // Remove the entry's file
        Utilities.write(this.#entry(id), null);
    }

    /**
     * Checks whether an entry exists in the table.
     * @param id ID
     */
    exists(id) {
        // Check whether the entry's file exists
        return Utilities.exists(this.#entry(id));
    }

    /**
     * Gets a value from the table.
     * @param id ID
     * @param key Key
     * @return {string} Value
     */
    get(id, key) {
        // Make sure the entry exists
        if (!this.exists(id))
            throw new Error(`Entry "${id}" does not exist`);

        // Read the entry's file
        let entry = Utilities.read(this.#entry(id));

        // Check whether the key is set
        if (key in entry) {
            // Read hash from entry
            let hash = entry[key];

            // Read the value file
            return Utilities.read(this.#value(key, hash));
        }

        // Return null (fallback)
        return null;
    }

    /**
     * Sets a value in the table.
     * @param id ID
     * @param key Key
     * @param value Value
     */
    set(id, key, value = null) {
        // Make sure the entry exists
        if (!this.exists(id))
            throw new Error(`Entry "${id}" does not exist`);

        // Read the entry's file
        let entry = Utilities.read(this.#entry(id));

        // Check whether the key is set already
        if (key in entry) {
            // Fetch the hash from the entry
            let hash = entry[key];

            // Delete the key in the entry
            delete entry[key];

            // Create an empty index
            let index = [];

            // Check whether the index file exists
            if (Utilities.exists(this.#index(key, hash)))
                // Read the index file
                index = Utilities.read(this.#index(key, hash));

            // Remove the id from the value index
            index.splice(index.indexOf(id), 1);

            // Write the index file
            Utilities.write(this.#index(key, hash), index);
        }

        // Make sure the value is not null
        if (value !== null) {
            // Generate the value hash
            let hash = Utilities.hash(value);

            // Set the key in the entry
            entry[key] = hash;

            // Create an empty index
            let index = [];

            // Check whether the index file exists
            if (Utilities.exists(this.#index(key, hash)))
                // Read the index file
                index = Utilities.read(this.#index(key, hash));

            // Push the id into the index
            index.push(id);

            // Write the index file
            Utilities.write(this.#index(key, hash), index);

            // Write the value file
            Utilities.write(this.#value(key, hash), value);
        }

        // Write the entry's file
        Utilities.write(this.#entry(id), entry);
    }

    /**
     * Searches for entries that match the key and value.
     * @param key Key
     * @param value Value
     */
    query(key, value) {
        // Generate the value hash
        let hash = Utilities.hash(value);

        // Create an empty index
        let index = [];

        // Check whether the index file exists
        if (Utilities.exists(this.#index(key, hash)))
            // Read the index file
            index = Utilities.read(this.#index(key, hash));

        // Return the index
        return index;
    }

    /**
     * Returns an entry file path.
     * @param id ID
     * @return {string} Path
     */
    #entry(id) {
        // Create the entries directory path
        let directory = Path.join(this.#directory, "entries");

        // Make sure the directory exists
        if (!FileSystem.existsSync(directory))
            FileSystem.mkdirSync(directory, { recursive: true });

        // Create the entry file path
        return Path.join(directory, id);
    }

    /**
     * Returns an index file path.
     * @param key Key
     * @param hash Value hash
     * @return {string} Path
     */
    #index(key, hash) {
        // Create the indexes & key directory path
        let directory = Path.join(this.#directory, "indexes", Utilities.hash(key));

        // Make sure the directory exists
        if (!FileSystem.existsSync(directory))
            FileSystem.mkdirSync(directory, { recursive: true });

        // Create the index file path
        return Path.join(directory, hash);
    }

    /**
     * Returns an value file path.
     * @param key Key
     * @param hash Value hash
     * @return {string} Path
     */
    #value(key, hash) {
        // Create the values & key directory path
        let directory = Path.join(this.#directory, "values", Utilities.hash(key));

        // Make sure the directory exists
        if (!FileSystem.existsSync(directory))
            FileSystem.mkdirSync(directory, { recursive: true });

        // Create the value file path
        return Path.join(directory, hash);
    }
}