from flask import Flask, request, jsonify

# Initialize the application
app = Flask(__name__)


def endpoint(**types):
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
            except BaseException as e:
                # Create error response
                return jsonify(str(e)), 500

        # Return the wrapper
        return wrapper

    # Return the decorator
    return decorator
