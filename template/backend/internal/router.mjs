/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

/**
 * This class routes requests to their routes while validating parameters.
 */
export default class Router {

    /**
     * Creates a new router instance.
     */
    constructor() {
        // Create the routing table
        this.routes = {};
    }

    /**
     * Inserts a new route.
     * @param name Name
     * @param route Route
     */
    insert(name, route) {
        // Make sure the route does not exist already
        if (name in this.routes)
            throw new Error(`Route "${name}" already exists`);

        // Insert the route to the routes object
        this.routes[name] = route;
    }

    /**
     * Routes incoming requests and validates their parameters.
     * @param route Route
     * @param action Action
     * @param parameters Parameters
     * @return {Promise<string>} Result
     */
    async route(route, action, parameters) {
        // Initialize the search object
        let object = this.routes;

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

                // Create a temporary result
                let validated = false;

                // Check whether the validator is a callable (generic validator)
                if (typeof validator === "function") {
                    // Try validating using the callable
                    try {
                        if (await validator(parameters[parameter]))
                            validated = true;
                    } catch (e) {
                        // Ignore errors
                    }
                }

                // Check whether the validator is a string (type validator)
                if (typeof validator === "string") {
                    // Validate types
                    if (typeof parameters[parameter] === validator)
                        validated = true;
                }

                // Make sure the validation passes
                if (!validated)
                    throw new Error(`Invalid "${parameter}" parameter`);
            }
        }

        // Execute the handler
        return object.handler(parameters);
    }

}