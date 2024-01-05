import os
import traceback

# Import flask utilities
from flask import Flask, request, jsonify
from flask.sansio.scaffold import setupmethod

# Initialize debug mode
DEBUG = int(os.environ.get("DEBUG", "0"))

# Type checking prefix
PREFIX = "type_"


class Router(Flask):

    @setupmethod
    def route(self, rule, **options):

        # Fetch all the types
        types = {
            # Create a key: value without prefix
            key[len(PREFIX):]: options.pop(key)
            # For all keys in options
            for key in list(options)
            # That start with the prefix
            if key.startswith(PREFIX)
        }

        # Create wrapper for route that will get all arguments from request
        def decorator(function):
            # Create the wrapper function
            def wrapper(**kwargs):
                try:
                    # Update the kwargs with JSON parameters
                    if request.is_json:
                        # Update with JSON content
                        kwargs.update(request.json)

                    # Update the kwargs with form parameters
                    if request.form:
                        kwargs.update(request.form)

                    # Update the kwargs with URL parameters
                    if request.args:
                        kwargs.update(request.args)

                    # Validate all the parameters
                    for key, value_type in types.items():
                        # Convert the value using the type
                        kwargs[key] = value_type(kwargs.get(key))

                    # Get the result
                    result = function(**kwargs)

                    # Provide all parameters to function
                    return jsonify(result), 200
                except BaseException as exception:
                    # If debug mode is enabled, return stack
                    if DEBUG:
                        return traceback.format_exc(), 500

                    # Create error response from exception
                    return str(exception), 500

            # Register the wrapper function
            endpoint = options.pop("endpoint", None)
            self.add_url_rule(rule, endpoint, wrapper, **options)

            # Return the original function
            return function

        # Return the decorator
        return decorator


# Initialize the application
router = Router(__name__)
