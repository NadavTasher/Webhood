/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import HTTP from "http";

// Import internal parts
import Router from "./router.mjs";

/**
 * This class handles requests, parses them then passes them to the internal router.
 */
export default class Server {

    /**
     * Creates a new server instance.
     * @param port Listening port
     */
    constructor(port = 8000) {
        // Set the port
        this.port = port;

        // Create the router
        this.router = new Router();
    }

    /**
     * Starts listening for requests.
     */
    listen() {
        // Start listening for incoming requests
        HTTP.createServer(async (request, response) => {
            // Create the initial output
            let output = {
                status: false,
                result: null
            };

            // Try parsing the request and routing it
            // Try parsing the request
            try {
                // Parse route and action from URL
                let split = request.url.split("/", 3).slice(1);

                // Store route name
                let routeName = split.shift();

                // Make sure the route name is valid
                if (routeName === undefined || routeName.length === 0)
                    throw new Error(`Missing route name`);

                // Store action name
                let actionName = split.shift();

                // Make sure the action name is valid
                if (actionName === undefined || actionName.length === 0)
                    throw new Error(`Missing action name`);

                // Read all of the request data
                let data = await this.#read(request);

                // Parse data as JSON
                let parameters = JSON.parse(data);

                // Handle the request
                output.result = await this.router.route(routeName, actionName, parameters);
                output.status = true;
            } catch (error) {
                output.result = error.message;
                output.status = false;
            }

            // Set output header
            response.setHeader("Content-Type", "application/json");

            // Write output
            response.write(JSON.stringify(output));

            // End response
            response.end();
        }).listen(this.port);
    }

    /**
     * Reads a request's body in a buffered manner while returning a promise which is resolved when there's no more data to read.
     * @param request Request
     * @return {Promise<string>} Promise
     */
    #read(request) {
        // Return a promise for data
        return new Promise((resolve, reject) => {
            // Create a chunk buffer
            const chunks = [];

            // Wait for new data chunks
            request.on("data", async (chunk) => {
                // Push the new chunk to the buffer
                chunks.push(chunk);
            });

            // Handle the end of the data
            request.on("end", async () => {
                // Concatenate the chunks buffer
                const data = Buffer.concat(chunks).toString();

                // Resolve the promise
                resolve(data);
            });
        });
    }
}