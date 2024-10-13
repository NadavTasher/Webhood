# Webhood

![Builds](https://github.com/NadavTasher/Webhood/actions/workflows/build.yml/badge.svg)

Webhood is a simple to use, full-stack web-application framework for creating small to mid-size projects.

It does not require any external dependencies for simple projects, and can be easily extended for more specialized applications.

## Getting started

Creating your own application using Webhood couldn't be easier.

Get yourself a copy of the repository. You can [clone it](https://github.com/NadavTasher/Webhood), [fork it](https://github.com/NadavTasher/Webhood/fork) or [download it directly](https://github.com/NadavTasher/Webhood/archive/refs/heads/master.zip).

Choose the bundle thats right for you:

1. [Headless](https://github.com/NadavTasher/Webhood/tree/master/bundles/headless) - if you only mean to use Webhood's frontend utilities **or** need a self-contained no-external-resources boilerplate, this one is for you.
2. [Buildless](https://github.com/NadavTasher/Webhood/tree/master/bundles/buildless) - if you do not plan on doing any build changes (like adding more libraries) and are not planning on a complex backend API, this bundle leverages the use of `docker`'s read-only bind mounts to secure your sources in the container.
3. [Independent](https://github.com/NadavTasher/Webhood/tree/master/bundles/independent) - this bundle is the All-Star bundle. It allows you to tinker, extend, customize and build your application the way you want.

### Step-by-step guide for creating a new application

```bash
# Clone webhood locally
git clone git@github.com:NadavTasher/Webhood.git Webhood

# Create a new project
cp -r Webhood/bundles/independent ./New-Project && cd ./New-Project

# Initialize a new Git repository
git init
git add --all
git commit -m "Initial commit"
```

## Tech stack

Webhood is based on popular projects and strives to keep the application architecture simple efficient.

1. Python backend is powered by [Starlette](https://www.starlette.io/) - an open-source WSGI framework. See [usage](https://github.com/NadavTasher/Webhood/blob/master/image/src/backend/webhood/router.py).
1. Web server duties are handled by [Gunicorn](https://gunicorn.org/) - an open-source WSGI server. See [usage](https://github.com/NadavTasher/Webhood/blob/master/image/resources/entrypoint.conf).
2. Database duties are handled by [Redis](https://redis.io/) using the [rednest](https://pypi.org/rednest/) library.
3. Frontend duties are handled by custom JS and CSS files in [src/frontend](https://github.com/NadavTasher/Webhood/tree/master/image/src/frontend). An example can be seen [here](https://github.com/NadavTasher/Webhood/blob/master/bundles/headless/test-page.html).

## Examples

You can easily spin up one of the example applications found [here](https://github.com/NadavTasher/Webhood/tree/master/examples).

## Features

### Frontend

#### Built-in automatic dark mode

By default, the color scheme is defined by the system configuration.

This behaviour can be disabled - exclude the `/stylesheets/colors.css` file from your page, and create a custom color scheme:

```css
:root {
	--text: #707070;
	--theme: #ffffff;
	--active: #c0c0c0;
	--passive: #f0f0f0;
}
```

#### Built-in CSS classes

All of these classes can be demoed using the `test-page.html` file, provided [here](https://github.com/NadavTasher/Webhood/blob/master/resources/tests/test-page.html) or [here (headless bundle)](https://github.com/NadavTasher/Webhood/blob/master/bundles/headless/test-page.html)

Row & Column (every `<div>` is a column by default):

```html
<!-- This is a row -->
<div class="row">
	<button>Left Item</button>
	<button>Right Item</button>
</div>
<!-- This is a column -->
<div class="column">
	<button>Top Item</button>
	<button>Bottom Item</button>
</div>
```

Left, Right & Center (every element is centered by default):

```html
<!-- This works on text -->
<p class="left">This text is aligned to the left</p>
<p class="center">This text is aligned to the center</p>
<p class="right">This text is aligned to the right</p>

<!-- But also on rows -->
<div class="row left">
	<button>Left Aligned</button>
</div>
<div class="row">
	<button>Center Aligned</button>
</div>
<div class="row right">
	<button>Right Aligned</button>
</div>
```

Stretching elements:

```html
<!-- The children of this row will occupy all of the available width equally -->
<div class="row stretch">
	<button>Button 1</button>
	<button>Button 2</button>
	<button>Button 3</button>
</div>

<!-- Only the "stretched" child will try to fill the available width -->
<div class="row">
	<button class="stretched">A very wide button</button>
	<button>Just a button</button>
</div>

<!-- The "stubborn" element will not allow you to resize it beyond it's minimal width -->
<div class="row">
	<button class="stretched">A very wide button</button>
	<button class="stubborn">Can't squish me!</button>
</div>
```

Text sizes:

```html
<p class="tiny">Tiny text</p>
<p class="small">Small text</p>
<p class="medium">Medium text</p>
<p class="large">Large text</p>
<p class="huge">Huge text</p>
```

Coasted elements:

```html
<div class="row coasted">
	<p class="small">Some text</p>
</div>
```

Hidden elements:

```html
<!-- This will make the element hidden -->
<!-- You can use $("#hidden-element").show() to show the element -->
<div id="hidden-element" hidden>
	<p class="medium left">Some hidden text</p>
</div>

<!-- This also hides elements, but they cannot be shown using JavaScript -->
<div id="hidden-element" class="hidden">
	<p class="medium left">Some hidden text</p>
</div>
```

#### Built-in modal support

Progress screen:

```javascript
// Instead of writing
const response = await fetch("/my-resource");

// You can use progressScreen
const response = await progressScreen("Fetching resource", fetch("/my-resource"));
```

Alert dialog:

```javascript
// ...
if (state.isDangerous) await alertDialog("The current conditions are dangerous. Take care!", { closeText: "Acknowledged!" });
// ...
```

Confirm dialog:

```javascript
try {
	// Ask for user confirmation (with optional arguments)
	await confirmDialog("Are you sure you want to delete this item?", { approveText: "Delete item" });

	// Delete item
	await POST("/api/delete_item", { item });
} catch (e) {
	await alertDialog(e);
}
```

Prompt dialog:

```javascript
try {
	// Ask user for their password (with optional arguments - type makes the input a password input)
	const name = await promptDialog("What is your password?", { placeholder: "Your password goes here", declineText: "I don't know", type: "password" });

	console.log(`User's password is ${name}`);
} catch (e) {
	// User might have cancelled the prompt
	console.log(e);
}
```

#### JavaScript element shortcuts

Selecting elements using queries:

```javascript
// Selecting using $ and $$
const myButton = $("#my-button");
const allOfMyButtons = $$(".my-button-class");

// Selecting using strings
const myButton = "#my-button".find();
const allOfMyButtons = ".my-button-class".findAll();
```

Reading & Writing element contents:

```javascript
// Read user input
const myValue = $("#input").read();

// Write some text
$("#output").write("Some text");
```

Changing layout:

```javascript
// Clearing all items from element
$("#my-element-list").clear();

// Hiding an element
$("#my-secret-password-view").hide();

// Showing an element
$("#my-secret-hidden-output").show();

// Removing an element
$("#my-temporary-item").remove();

// Changing to a sub-page
$("#checkout-subpage").view();

// Changing to a sub-page without changing page history
$("#checkout-subpage").view(false);
```

Creating elements from templates:

Create yourself a template:

```html
<template id="my-template">
	<div class="coasted">
		<p class="small left">My name is ${ name }</p>
		<p class="tiny left">This year I will be ${ age + 1 } years old!</p>
		<button class="tiny center" name="some-button">Click me</button>
	</div>
</template>
```

Create items from that template:

```javascript
// Create a new item from the template
const myItem = $("#my-template").populate({
	name: "John",
	age: age,
});

// Add a click listener to the button
myItem.find("some-button").addEventListener("click", () => {
	alertDialog(`My current age is ${age}`);
});
```

#### General utilities

Sleep promise function:

```javascript
// Sleep 1 second
await sleep(1000);
```

String interpolation using format strings:

```javascript
// In addition to using regular format strings like this:
const myString = `My name is ${name} and I'm ${age} years old`;

// You can use:
const myString = "My name is ${name} and I'm ${age} years old".interpolate({ name, age });
```

#### Backend interaction utilities

GET API function:

```javascript
const uptime = await GET("/api/uptime");
```

POST API function:

```javascript
const result = await POST("/api/update_name", { name: name, password: password });
```

WebSocket connection function:

```javascript
socket("/socket/notifications", (data, socket) => console.log(data));
```

### Backend

#### Background worker

A background worker can be configured to run background jobs.

This is a convenience feature that can be disabled using the entrypoint configuration file. Just set `replication=0` and the process will never be launched.

#### Request type checking & casting

A `flask` like routing mechanism takes place, with an addition of runtime type-checking using the [runtypes](https://github.com/NadavTasher/RunTypes) library.

These features can be taken advantage of like so:

```python
import hashlib

from runtypes import Optional, Text, ByteString

from webhood.router import PlainTextResponse, router


@router.get("/api/code")
def code_request(head: Optional[int] = None):
	"""
	This endpoint takes an optional int parameter.
	If "head" will be present in the query parameters or the body,
	it will be validated against the int type.
	If it will not be present, the parameter will not pass to the request
	and whatever you configure as a function-signature default will be used.
	"""

    # Read the uptime
    with open(__file__, "r") as code_file:
        code = code_file.read()

    # If all data is to be returned, return all
    if head is None:
        return PlainTextResponse(code)

    # Split code to lines
    lines = code.splitlines(keepends=True)

    # Take only specific lines
    assert 0 < head <= len(lines), "Head range invalid"

    # Take just the first "head" lines
    return PlainTextResponse(str().join(lines[:head]))


@router.post("/api/echo")
def echo_request(name: str):
	"""
	This endpoint takes a mandatory Text parameter.
	If "name" will be present in the query parameters or the body,
	it will be validated against the Text type.
	If it will not be present, the router will raise an error because
	the parameter is missing.
	"""

    # Return the given parameter
    return name


@router.post("/api/md5sum")
def md5sum_request(content_type: Text, content_data: ByteString):
	"""
	This endpoint takes a mandatory Content-Type header and the body is a mandatory Bytes type.
	"""

	# Return the hexdigest of the body
    return hashlib.md5(content_data).hexdigest().decode()


# Initialize the application
app = router.initialize()
```

By default, all type validations default to **casting** the input to the required type.
If only checking is desired, this default option can be overriden using:

```python
@router.get("/api/code", cast=False)
def code_request(head: Optional[int] = None):
	...
```

#### WebSocket support

WebSocket integration requires the use of `asyncio`.

```python
import hashlib

from runtypes import Text

from webhood.router import WebSocket, router


@router.socket("/socket/notifications")
async def notifications_socket(websocket: WebSocket, id: Text) -> None:
	# Run additional validations here...

	# Accept the client
	await websocket.accept()

    # Send the initial string
    await websocket.send_text("Some data")

    # Loop until client closes
    while websocket:
        # Receive the next string from the client
        client_data = await websocket.receive_text()

        # Send the same string
        await websocket.send_text("New data")


# Initialize the application
app = router.initialize()
```

#### Redis database support

Note that for database backups to take place, a Docker volume must be mounted on `/opt`.

```python
import hashlib

from webhood.router import router
from webhood.database import wait_for_redis_sync, redict

# Wait for redis to ping back before operating on database
wait_for_redis_sync()

# Initialize the database
DATABASE = redict("clicker-database")
DATABASE.setdefaults(clicks=0)


@router.get("/api/click")
def click():
	# Increment the counter
	DATABASE.clicks += 1

	# Return the click count
	return DATABASE.clicks


# Initialize the application
app = router.initialize()
```

#### Redis Pub / Sub support

The [`utilities/redis.py`](https://github.com/NadavTasher/Webhood/blob/master/image/src/backend/utilities/redis.py) file implements simple `broadcast_(sync/async)` / `receive_(sync/async)` interfaces for using Pub / Sub for realtime applications.

```python
import hashlib

from webhood.router import router
from webhood.database import wait_for_redis_sync, broadcast_sync, receive_async, redict

# Wait for redis to ping back before operating on database
wait_for_redis_sync()

# Initialize the database
DATABASE = redict("clicker-database")
DATABASE.setdefaults(clicks=0)


@router.get("/api/click")
def click():
	# Increment the counter
	DATABASE.clicks += 1

	# Notify all listeners
	broadcast_sync("clicks", index=DATABASE.clicks)

	# Return the click count
	return DATABASE.clicks


@router.post("/api/wait_for_click")
async def wait_for_click():
	# Wait for a single click
	async for click in receive_async("clicks", count=1):
		return click.index


@router.socket("/socket/notifications")
async def notify_clicks(websocket):
	# Accept the client
	await websocket.accept()

	# Wait for clicks
	async for click in receive_async("clicks"):
		websocket.send_text(click.index)


# Initialize the application
app = router.initialize()
```

### Container entrypoint

The entrypoint of the image, is [`entrypoint.py`](https://github.com/NadavTasher/Webhood/blob/master/image/src/entrypoint.conf).

This entrypoint is a simple Python process watcher.
It stops when one of it's direct children exits, and terminates the others.

A sample configuration can be found [here](https://github.com/NadavTasher/Webhood/blob/master/image/resources/entrypoint.conf).

## Contributing

Contributions are highly encouraged through pull-requests or issues, contact me at [hey@nadav.app](mailto:hey@nadav.app) if needed.
