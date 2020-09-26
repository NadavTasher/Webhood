/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import modules
import HTTP from "http";

/**
 * This class handles requests, parses them then passes them to the internal router.
 */
export default class Server {

    // Initialize private class members
    #port = null;
    #routes = null;

    /**
     * Creates a new server instance.
     * @param port Listening port
     */
    constructor(port = 8000) {
        // Set the port
        this.#port = port;
        // Create the routing table
        this.#routes = {};
    }

    // Public functions

    /**
     * Listens for requests.
     */
    listen() {
        // Start listening for incoming requests
        HTTP.createServer(this.#handle.bind(this)).listen(this.#port);
    }

    /**
     * Inserts a new route.
     * @param name Name
     * @param route Route
     */
    insert(name, route) {
        // Make sure the route does not exist already
        if (name in this.#routes)
            throw new Error(`Route "${name}" already exists`);

        // Insert the route to the routes object
        this.#routes[name] = route;
    }

    // Private functions

    /**
     * Passes requests for parsing and ensures a consistent output format.
     * @param request Incoming request
     * @param response Outgoing response
     * @return {Promise<void>}
     */
    async #handle(request, response) {
        // Create the initial output
        let output = {
            status: false,
            result: null
        };

        try {
            // Handle the request
            output.result = await this.#parse(request);
            output.status = true;
        } catch (error) {
            // Write the error to the output object
            output.result = error.message;
            output.status = false;
        }

        // Set output header
        response.setHeader("Content-Type", "application/json");
        // Write output
        response.write(JSON.stringify(output));
        // End response
        response.end();
    }

    /**
     * Parses requests and passes them for routing.
     * @param request Incoming request
     * @return {Promise<*>} Result
     */
    async #parse(request) {
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
        let data = await new Promise((resolve) => {
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

        // Parse data as JSON
        let parameters = JSON.parse(data);

        // Handle the request
        return await this.#route(routeName, actionName, parameters);
    }

    /**
     * Routes actions to the correct routes while validating parameters.
     * @param route Route (API)
     * @param action Action (Function)
     * @param parameters Parameters (Arguments)
     * @return {Promise<*>} Result
     */
    async #route(route, action, parameters) {
        // Initialize the search object
        let object = this.#routes;

        // Make sure the route exists
        if (!(route in object))
            throw new Error(`Route "${route}" does not exist`);

        // Change object context
        object = object[route];

        // Make sure the action exists
        if (!(action in object))
            throw new Error(`Action "${action}" does not exist`);

        // Change object context
        object = object[action];

        // Make sure the object has the correct structure
        if (!(object.hasOwnProperty("handler") && object.hasOwnProperty("parameters")))
            throw new Error(`Action "${action}" is malformed`);

        // Validate parameters
        for (let parameter in object.parameters) {
            // Make sure the parameter is not an internal property
            if (object.parameters.hasOwnProperty(parameter)) {
                // Make sure the parameter exists in the request parameters
                if (!(parameter in parameters))
                    throw new Error(`Missing "${parameter}" parameter`);

                // Store the validator in a temporary object
                let validator = object.parameters[parameter];

                // Check whether the validator is a callable (generic validator)
                if (typeof validator === "function") {
                    // Try validating using the callable
                    if (!await validator(parameters[parameter]))
                        throw new Error(`Invalid "${parameter}" parameter`);
                }

                // Check whether the validator is a string (type validator)
                if (typeof validator === "string") {
                    // Validate types
                    if (typeof parameters[parameter] !== validator)
                        throw new Error(`Invalid "${parameter}" parameter`);
                }
            }
        }

        // Execute the handler
        return object.handler(parameters);
    }
}