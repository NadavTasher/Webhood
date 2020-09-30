/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

// Import internal parts
import Server from "./internal/server/server.mjs";

// Create the server
let server = new Server(8000);

// Import the routes
import base from "./external/base.mjs";

// Enable the routes
server.insert("base", base);

// Listen for requests
server.listen();