import os
import logging
import traceback

# Import flask utilities
from flask import Flask, request, jsonify

# Initialize debug mode
DEBUG = int(os.environ.get("DEBUG", "0"))

# Type checking prefix
PREFIX_REQUIRED = "type_"
PREFIX_OPTIONAL = "optional_"


class Router(Flask):

    def route(self, rule, **options):
        # Fetch all of the required types
        required_types = {
            # Create a key: value without prefix
            key[len(PREFIX_REQUIRED):]: options.pop(key)
            # For all keys in options
            for key in list(options)
            # That start with the prefix
            if key.startswith(PREFIX_REQUIRED)
        }

        # Fetch all of the optional types
        optional_types = {
            # Create a key: value without prefix
            key[len(PREFIX_OPTIONAL):]: options.pop(key)
            # For all keys in options
            for key in list(options)
            # That start with the prefix
            if key.startswith(PREFIX_OPTIONAL)
        }

        # Create wrapper for route that will get all arguments from request
        def decorator(function):
            # Create the wrapper function
            def wrapper(**flask_kwargs):
                try:
                    # Update the kwargs with JSON parameters
                    if request.is_json:
                        flask_kwargs.update(request.json)

                    # Update the kwargs with form parameters
                    if request.form:
                        flask_kwargs.update(request.form)

                    # Update the kwargs with URL parameters
                    if request.args:
                        flask_kwargs.update(request.args)

                    # Create the actual parameters
                    function_kwargs = dict()

                    # Validate must-have arguments
                    for key, value_type in required_types.items():
                        # Make sure the required argument exists
                        if key not in flask_kwargs:
                            raise KeyError("Argument %r is missing" % key)

                        # Try casting into the value type
                        function_kwargs[key] = value_type(flask_kwargs[key])

                    # Validate optional arguments
                    for key, value_type in optional_types.items():
                        # Check whether the argument exists
                        if key not in flask_kwargs:
                            continue

                        # Try casting into the value type
                        function_kwargs[key] = value_type(flask_kwargs[key])

                    # Get the result
                    result = function(**function_kwargs)

                    # Check if the result is a response
                    if isinstance(result, self.response_class):
                        return result

                    # Create JSON response from result
                    return jsonify(result), 200
                except BaseException as exception:
                    # If debug mode is enabled, return stack
                    if DEBUG:
                        # Log the exception
                        logging.exception("Exception in %s:", rule)

                        # Return the full traceback
                        return traceback.format_exc(), 500

                    # Create error response from exception
                    return str(exception), 500

            # Decide the endpoint name
            endpoint = options.pop("endpoint", rule + repr(options.get("methods")))

            # Register the wrapper function
            self.add_url_rule(rule, endpoint, wrapper, **options)

            # Return the original function
            return function

        # Return the decorator
        return decorator


# Initialize the application
router = Router(__name__)
