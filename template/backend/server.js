// Import the HTTP module
const HTTP = require("http");

// Import the router module
const route = require("./modules/server/route.js");

// Import the file-server module
const serve = require("./modules/server/serve.js");

// Create a new HTTP server and start listening
HTTP.createServer(function (request, response) {
    // Check whether an API request needs to be processed
    if (request.method === "POST") {
        // Execute API logic
        route(request, response);
    } else {
        // Serve static files
        serve(request, response);
    }
}).listen(80);