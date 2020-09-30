/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import Path from "path";
import FileSystem from "fs";

// Import utilities
import Variable from "../utilities/variable.mjs";

/**
 * A simple interface for reading and writing database tables.
 */
export default class Table {

    // Initialize root directories
    #root = null;

    #entries = null;
    #indexes = null;

    // Initialize scheme
    #scheme = null;

    /**
     * Table constructor.
     * @param name Table name
     * @param root Parent directory
     */
    constructor(name, scheme = {}, root = "/opt") {
        // Make sure the name is valid
        Variable.validate(name, "key");

        // Initialize the schema
        this.#scheme = scheme;

        // Initialize the root directory path
        this.#root = Path.join(root, name);

        // Make sure the directory exists
        if (!FileSystem.existsSync(this.#root))
            FileSystem.mkdirSync(this.#root);

        // Create subdirectories
        this.#entries = Path.join(this.#root, "entries");
        this.#indexes = Path.join(this.#root, "indexes");

        if (!FileSystem.existsSync(this.#entries))
            FileSystem.mkdirSync(this.#entries);

        if (!FileSystem.existsSync(this.#indexes))
            FileSystem.mkdirSync(this.#indexes);
    }

    /**
     * Checks whether a database entry exists.
     * @param id ID
     */
    has(id) {
        // Make sure the ID is valid
        Variable.validate(id, "id");

        // Check whether the entry exists
        return FileSystem.existsSync(Path.join(this.#entries, id));
    }

    /**
     * Reads an entry from the database.
     * @param id ID
     */
    get(id) {
        // Make sure the ID is valid
        Variable.validate(id, "id");

        // Make sure the entry exists
        if (!this.has(id))
            throw new Error(`Entry does not exists`);

        // Read the entry
        let object = JSON.parse(FileSystem.readFileSync(Path.join(this.#entries, id)));

        // Make sure the entry adheres to the scheme
        this.#validate(object);

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
        Variable.validate(id, "id");

        // Make sure the entry adheres to the scheme
        this.#validate(entry);

        // Read the entry
        FileSystem.writeFileSync(Path.join(this.#entries, id), JSON.stringify(entry));
    }

    /**
     * Indexes entries.
     * @param name Index name
     * @param coordinate Entry coortinate
     * @param indexer Indexer function
     */
    index(name, coordinate, indexer = (value) => Hash.hash(value)) {
        // Make sure the name is valid
        Variable.validate(name, "key");

        // Generate the file path
        let path = Path.join(this.#indexes, name);

        // Create the index object
        let index = {};

        // Read a list of all available entry IDs
        let ids = FileSystem.readdirSync(this.#entries);

        // Loop over IDs
        for (let id in ids) {
            // Try reading the entry and indexing
            try {
                // Execute the indexer
                let result = indexer(this.#find(coordinate, this.get(id)));

                // Make sure the result is a string
                if (Variable.valid(result, "string")) {
                    // Make sure the sub-index is initialized
                    if (!index.hasOwnProperty(result))
                        index[result] = [];

                    // Push ID onto index
                    index[result].push(id);
                }
            } catch (e) {
                // Ignore errors
            }
        }

        // Write index to file
        FileSystem.writeFileSync(path, JSON.stringify(index));
    }

    /**
     * Searches through indexes.
     * @param name Index name
     * @param value Search query
     * @param searcher Query transformer
     */
    search(name, value, searcher = (query) => Hash.hash(query)) {
        // Make sure the name is valid
        Variable.validate(name, "key");

        // Generate the file path
        let path = Path.join(this.#indexes, name);

        // Make sure the index exists
        if (!FileSystem.existsSync(path))
            throw new Error(`Index does not exist`);

        // Read the index from the file
        let index = JSON.parse(FileSystem.readFileSync(path));

        // Execute the searcher
        return index[searcher(value)];
    }

    /**
     * Finds a value in an object with a given coordinate.
     * @param coordinate Coordinate
     * @param object Object
     */
    #find(coordinate, object) {
        // Make sure coordinate is a string
        Variable.validate(coordinate, "string");

        // Make sure the object is an object
        Variable.validate(object, "object");

        // Split coordinate with "."
        let parts = coordinate.split(".", 2);

        // Find the object
        object = object[parts.shift()];

        // Check if there are more parts in the array
        if (parts.length > 0)
            return this.#find(parts.shift(), object);

        // Return found object
        return object;
    }

    /**
     * Validates object schemes.
     * @param object Object
     * @param scheme Validation scheme
     */
    #validate(object, scheme = this.#scheme) {
        // Make sure both the object and the scheme are objects
        Variable.validate(object, "object");
        Variable.validate(scheme, "object");

        // Loop over scheme to make sure the object has all the nececairy entries
        for (let key in scheme) {
            // Make sure the key is valid
            Variable.validate(key, "key");

            // Make sure the object has this key
            if (!object.hasOwnProperty(key))
                throw new Error(`Provided object is missing the "${key}" property`);

            // Check whether the current key points to an object
            if (Variable.valid(scheme[key], "object")) {
                // Validate recursively
                this.#validate(object[key], scheme[key]);
            } else {
                // Make sure the scheme value is a string
                if (!Variable.valid(scheme[key], "string"))
                    throw new Error(`Invalid scheme "${key}" property`);

                // Make sure the object type matches the scheme type
                if (!Variable.valid(object[key], scheme[key]))
                    throw new Error(`Invalid object "${key}" property`);
            }
        }
    }
}