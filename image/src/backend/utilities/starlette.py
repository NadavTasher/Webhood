import typing
import inspect

# Import debug utilities
from utilities.debug import DEBUG

# Import starlette utilities
from starlette.routing import Mount, Route, WebSocketRoute
from starlette.requests import Request
from starlette.responses import Response, JSONResponse, PlainTextResponse
from starlette.websockets import WebSocket
from starlette.staticfiles import StaticFiles
from starlette.applications import Starlette

# Import typing utilities
from runtypes import cast_type_hints, check_type_hints

# Type checking prefix
PREFIX_REQUIRED = "type_"
PREFIX_OPTIONAL = "optional_"

# Header for content parsing
HEADER_CONTENT_TYPE = "Content-Type"

# Mime-types for content parsing
MIMETYPE_JSON = "application/json"
MIMETYPE_DEFAULT = "application/octet-stream"
MIMETYPE_SIMPLE_FORM = "application/x-www-form-urlencoded"
MIMETYPE_MULTIPART_FORM = "multipart/form-data"


def gather_types(types):
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


async def gather_parameters(request_or_websocket: typing.Union[Request, WebSocket]):
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

    # Only parse data if content-type header was provided
    if HEADER_CONTENT_TYPE not in request_or_websocket.headers:
        return parameters

    # Fetch the request content type
    content_type = request_or_websocket.headers.get(HEADER_CONTENT_TYPE, MIMETYPE_DEFAULT)

    # If the content is a form body, parse it
    if content_type == MIMETYPE_SIMPLE_FORM or content_type.startswith(MIMETYPE_MULTIPART_FORM):
        # Fetch the form body
        form_object = await request_or_websocket.form()

        # Make sure form object is a dictionary
        if not isinstance(form_object, dict):
            raise TypeError("Form body must be a dictionary")

        # Update the request parameters using the form body
        for key, value in form_object.items():
            parameters.setdefault(key, value)
    elif content_type == MIMETYPE_JSON:
        # Fetch the JSON body
        json_object = await request_or_websocket.json()

        # Make sure JSON object is a dictionary
        if not isinstance(json_object, dict):
            raise TypeError("JSON body must be a dictionary")

        # Update the request parameters using the JSON body
        for key, value in json_object.items():
            parameters.setdefault(key, value)
    else:
        # Fetch the content data
        content_data = await request_or_websocket.body()

        # Provide the content parameters
        parameters.update(content_type=content_type, content_data=content_data)

    # Return the parsed parameters
    return parameters


class Router(object):

    def __init__(self, static_directory: typing.Optional[str] = None) -> None:
        # Initialize routes
        self.routes = []

        # Create the static files route as needed
        if static_directory is not None:
            self.routes.append(Mount(path="/", app=StaticFiles(directory=static_directory, html=True)))

    def socket(self, path, cast=True):
        # Create a decorator function
        def decorator(function):
            # Make sure the function is a coroutine function
            assert inspect.iscoroutinefunction(function), "Socket routes must be async"

            # Create the request endpoint function
            async def endpoint(websocket: WebSocket) -> None:
                # Create a dictionary to store all of the paremters
                parameters = await gather_parameters(websocket)

                # Process the parameters
                if cast:
                    parameters = cast_type_hints(function, [websocket], parameters)
                else:
                    parameters = check_type_hints(function, [websocket], parameters)

                try:
                    # Call the function
                    await function(**parameters)
                finally:
                    # Close the websocket
                    await websocket.close()

            # Append the route
            self.routes.append(WebSocketRoute(path, endpoint=endpoint, name=function.__name__))

            # Return the original function
            return function

        # Return the decorator
        return decorator

    def route(self, path, methods, cast=True):
        # Create a decorator function
        def decorator(function):

            # Create the request endpoint function
            async def endpoint(request: Request) -> Response:
                # Create a dictionary to store all of the paremters
                parameters = await gather_parameters(request)

                # Process the parameters
                if cast:
                    parameters = cast_type_hints(function, [], parameters)
                else:
                    parameters = check_type_hints(function, [], parameters)

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

    def initialize(self):
        # Create exception handler
        exception_handlers = {
            # When any exception occurs, return an exception string
            Exception: lambda request, exception: PlainTextResponse(str(exception), 500)
        }

        # Initialize the starlette application
        return Starlette(debug=DEBUG, routes=self.routes, exception_handlers=exception_handlers)


# Initialize the router
router = Router("/application/frontend")
