/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Require routes
const ROUTES = require("../../routes/routes.js");

/**
 * Routes requests to requested routes and parses action and parameters along the way.
 * @param request Request
 * @param response Response
 */
module.exports = function (request, response) {
    // Initialize route, action and parameters
    let route, action, parameters;

    // Split URL to slices using the "/" path separator
    let slices = request.url.split("/").slice(1);

    // Parse route and action from slices
    route = slices.shift();
    action = slices.shift();

    // Read contents and parse parameters
    let chunks = [];

    // Push new chunks onto the chunk buffer
    request.on("data", (chunk) => {
        chunks.push(chunk);
    });

    // Convert the chunks into a buffer and execute the action
    request.on("end", () => {
        // Initialize the response variables
        let status = false, result = "Unknown error";

        // Try parsing the buffer as JSON
        try {
            // Parse incoming data as JSON
            parameters = JSON.parse(Buffer.concat(chunks).toString());

            // Make sure all parameters are strings
            for (let key in parameters)
                if (parameters.hasOwnProperty(key))
                    if (typeof parameters[key] !== "string")
                        throw new Error("Invalid parameter type");

            // Look for the route handler
            let handler = ROUTES[route];

            // Make sure the handler exists
            if (handler === undefined)
                throw new Error("Invalid route name");

            // Execute the handler with the given parameters
            result = handler(action, parameters);

            // Change the status to "true"
            status = true;
        } catch (error) {
            // Fill the result with the error
            result = error.message;

            // Change the status to "false"
            status = false;
        }

        // Set content-type header
        response.setHeader("Content-Type", "application/json");

        // Write to response
        response.write(JSON.stringify({status: status, result: result}));

        // Send the response
        response.end();
    });
}