import os
import logging
import traceback

# Import flask utilities
from flask import Flask, request, jsonify

# Initialize debug mode
DEBUG = int(os.environ.get("DEBUG", "0"))

# Type checking prefix
PREFIX = "type_"


class Router(Flask):

    def route(self, rule, **options):
        # Fetch all of the types
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
                        # Fetch the value from the kwargs
                        value = kwargs.get(key)

                        try:
                            # Try casting into the value type
                            kwargs[key] = value_type(value)
                        except BaseException as exception:
                            # Re-raise type error with variable name
                            raise TypeError("Argument %r: %s" % (key, str(exception)))

                    # Get the result
                    result = function(**kwargs)

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
