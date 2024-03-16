import os
import json
import inspect
import contextlib

# Import typing utilities
from typing import Union

# Import starlette utilities
from starlette.routing import Route, WebSocketRoute
from starlette.requests import Request
from starlette.responses import Response, JSONResponse
from starlette.websockets import WebSocket
from starlette.applications import Starlette

# Get debug state
DEBUG = bool(int(os.environ.get("DEBUG", 0)))

# Type checking prefix
PREFIX_REQUIRED = "type_"
PREFIX_OPTIONAL = "optional_"


def gather_types(types: dict):
    # Fetch all of the required types
    required_types = {
        # Create a key: value without prefix
        key[len(PREFIX_REQUIRED):]: types.pop(key)
        # For all keys in options
        for key in list(types)
        # That start with the prefix
        if key.startswith(PREFIX_REQUIRED)
    }

    # Fetch all of the optional types
    optional_types = {
        # Create a key: value without prefix
        key[len(PREFIX_OPTIONAL):]: types.pop(key)
        # For all keys in options
        for key in list(types)
        # That start with the prefix
        if key.startswith(PREFIX_OPTIONAL)
    }

    # Return the type dicts and the remaining types
    return required_types, optional_types, types


async def gather_parameters(request_or_websocket: Union[Request, WebSocket]):
    # Create a dictionary to store all of the paremters
    parameters = dict()

    # Update the request parameters using the path parameters
    for key, value in request_or_websocket.path_params.items():
        parameters.setdefault(key, value)

    # Update the request parameters using the query paramters
    for key, value in request_or_websocket.query_params.items():
        parameters.setdefault(key, value)

    # Only parse data if request was provided
    if not isinstance(request_or_websocket, Request):
        return parameters

    # Update the request parameters using the form body
    for key, value in (await request_or_websocket.form()).items():
        parameters.setdefault(key, value)

    # Update the request parameters using the JSON body
    with contextlib.suppress(json.JSONDecodeError):
        for key, value in (await request_or_websocket.json()).items():
            parameters.setdefault(key, value)

    # Return the parsed parameters
    return parameters


def process_parameters(required_types, optional_types, parameters):
    # Validate must-have arguments
    for key, value_type in required_types.items():
        # Make sure the required argument exists
        if key not in parameters:
            raise KeyError("Parameter %r is missing" % key)

        # Try casting into the value type
        parameters[key] = value_type(parameters[key])

    # Validate optional arguments
    for key, value_type in optional_types.items():
        # Check whether the argument exists
        if key not in parameters:
            continue

        # Try casting into the value type
        parameters[key] = value_type(parameters[key])

    # Return the parameters
    return parameters


class Router(object):

    def __init__(self):
        # Initialize internals
        self.routes = list()

    def socket(self, path, **types):
        # Fetch all of the required types
        required_types, optional_types, types = gather_types(types)

        # Create a decorator function
        def decorator(function):
            # Make sure the function is a coroutine function
            assert inspect.iscoroutinefunction(function), "Socket routes must be async"

            # Create the request endpoint function
            async def endpoint(websocket):
                # Create a dictionary to store all of the paremters
                parameters = await gather_parameters(websocket)

                # Process the parameters
                parameters = process_parameters(required_types, optional_types, parameters)

                # Accept the websocket
                await websocket.accept()

                try:
                    # Call the function
                    await function(websocket, **parameters)
                finally:
                    # Close the websocket
                    await websocket.close()

            # Append the route
            self.routes.append(WebSocketRoute(path, endpoint=endpoint, name=function.__name__))

            # Return the original function
            return function

        # Return the decorator
        return decorator

    def route(self, path, methods, **types):
        # Fetch all of the required types
        required_types, optional_types, types = gather_types(types)

        # Create a decorator function
        def decorator(function):

            # Create the request endpoint function
            async def endpoint(request):
                # Create a dictionary to store all of the paremters
                parameters = await gather_parameters(request)

                # Process the parameters
                parameters = process_parameters(required_types, optional_types, parameters)

                # Call the function
                if inspect.iscoroutinefunction(function):
                    result = await function(**parameters)
                else:
                    result = function(**parameters)

                # Check if the result is a response
                if isinstance(result, Response):
                    return result

                # Return a JSON response
                return JSONResponse(result)

            # Append the route
            self.routes.append(Route(path, endpoint=endpoint, methods=methods, name=function.__name__ + repr(methods)))

            # Return the original function
            return function

        # Return the decorator
        return decorator

    def get(self, path, **types):
        return self.route(path, methods=["GET"], **types)

    def post(self, path, **types):
        return self.route(path, methods=["POST"], **types)

    def put(self, path, **types):
        return self.route(path, methods=["PUT"], **types)

    def delete(self, path, **types):
        return self.route(path, methods=["DELETE"], **types)


# Initialize the router
router = Router()


# Create the initialization function
def initialize():
    # Initialize the starlette application
    return Starlette(debug=DEBUG, routes=router.routes)
