import os
import logging
import traceback

# Import flask utilities
from flask import Flask, request, jsonify, make_response

# Get debug state
DEBUG = bool(int(os.environ.get("DEBUG", 0)))

# Type checking prefix
PREFIX_REQUIRED = "type_"
PREFIX_OPTIONAL = "optional_"


class Router(Flask):

    def add_url_rule(self, rule, endpoint=None, view_func=None, **options):
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

        # Create wrapper function
        def wrapper(**flask_kwargs):
            try:
                # Update the kwargs with JSON parameters
                if request.is_json:
                    flask_kwargs.update(request.json)

                # Update the kwargs with form and URL parameters
                if request.values:
                    flask_kwargs.update(request.values.to_dict())

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
                result = view_func(**function_kwargs)

                # Check if the result is a response
                if isinstance(result, self.response_class):
                    return result

                # Create JSON response from result
                return jsonify(result), 200
            except BaseException as exception:
                # If debug mode is enabled, return stack
                if self.debug:
                    # Log the exception
                    logging.exception("Exception in %s:", rule)

                    # Return the full traceback
                    error = traceback.format_exc()
                else:
                    # Create the error from the exception
                    error = str(exception)

                # Create error response from exception
                response = make_response(error)
                response.mimetype = "text/plain"

                # Return the error response
                return response, 500

        # Create the endpoint name
        endpoint = endpoint or rule + repr(options.get("methods", []))

        # Add the url rule using the parent
        return super(Router, self).add_url_rule(rule, endpoint, wrapper if view_func else view_func, **options)


# Initialize the application
router = Router(__name__)
router.debug = DEBUG
