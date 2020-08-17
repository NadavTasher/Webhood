/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Imports
const Path = require("path");
const FileSystem = require("fs");

/**
 * Serves static files for the frontend directory.
 * @param request Request
 * @param response Response
 */
module.exports = function (request, response) {
    // Initialize route, action and parameters
    let root = Path.resolve("../frontend");
    let requested = Path.join(root, request.url);

    // Check whether the request is for "index.html"
    if (requested.endsWith("/"))
        requested += "index.html";

    // Read the file
    FileSystem.readFile(requested, function (error, data) {
        // Check if there are no errors
        if (error) {
            // Respond with 404
            response.statusCode = 404;

            // End request
            return response.end();
        }

        // Write the data
        response.write(data);

        // End request
        return response.end();
    });
}