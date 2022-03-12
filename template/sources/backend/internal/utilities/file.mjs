/**
 * Copyright (c) 2021 Nadav Tasher
 * https://github.com/Webhood/Template/
 **/

// Imports for path and filesystem support
import Path from "path";
import FileSystem from "fs";

// Import constants for the class
export const OUTPUT = "/opt";

/**
 * A simple interface for accessing files.
 */
export class File {
	// Initialize file path
	#path = null;

	/**
	 * File constructor.
	 * @param path File path
	 * @param root Parent directory
	 */
	constructor(path, root = OUTPUT) {
		// Initialize the file path
		this.#path = Path.join(root, path);
	}

	/**
	 * Reads the file contents.
	 * @param fallback Fallback data
	 */
	read(fallback = null) {
		// Make sure the file exists
		if (!FileSystem.existsSync(this.#path))
			return fallback;

		// Read the contents
		return JSON.parse(FileSystem.readFileSync(this.#path));
	}

	/**
	 * Writes the file contents.
	 * @param data Data
	 */
	write(data = null) {
		// Write the data
		FileSystem.writeFileSync(this.#path, JSON.stringify(data));
	}
};