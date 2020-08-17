/**
 * Copyright (c) 2020 Nadav Tasher
 * https://github.com/NadavTasher/Template/
 **/

class API {
    /**
     * Sends an API call.
     * @param route Route
     * @param action Action
     * @param parameters Parameters
     * @return Promise
     */
    static call(route = null, action = null, parameters = {}) {
        return new Promise((resolve, reject) => {
            // Create a form
            let form = new FormData();

            // Append parameters to form
            for (let key in parameters) {
                if (parameters.hasOwnProperty(key))
                    form.append(key, parameters[key]);
            }

            // Perform the request
            fetch(`${route}/${action}`, {
                method: "post",
                body: JSON.stringify(parameters)
            }).then((response) => {
                response.json().then((result) => {
                    // Check the result's integrity
                    if (result.hasOwnProperty("status") && result.hasOwnProperty("result")) {
                        // Call the callback with the result
                        if (result["status"] === true) {
                            resolve(result["result"]);
                        } else {
                            reject(result["result"]);
                        }
                    } else {
                        // Reject with an error
                        reject("API response malformed");
                    }
                }).catch((reason) => {
                    // Reject with an error
                    reject("API response malformed");
                });
            });
        });
    }
}