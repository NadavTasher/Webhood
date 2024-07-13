# Webhood
Builds are ran on GitHub Actions.

![Builds](https://github.com/NadavTasher/Webhood/actions/workflows/build.yml/badge.svg)

## What is Webhood?
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

1. Web server duties are handled by [NGINX](https://nginx.org/). NGINX serves as a static file server and as a reverse-proxy for the backend API. NGINX also handles TLS.
2. Python backend is powered by [Starlette](https://www.starlette.io/) - an open-source WSGI framework that is the basis for many open-source projects. In our case, Starlette is extended by the [router.py](https://github.com/NadavTasher/Webhood/blob/master/image/src/backend/router.py) file.
3. Frontend duties are handled by a couple of utility JavaScript and CSS files residing in [src/frontend](https://github.com/NadavTasher/Webhood/tree/master/image/src/frontend). You can see an example of the frontend capabilities in the [Headless Test Page](https://github.com/NadavTasher/Webhood/blob/master/bundles/headless/test-page.html).

## Features
### Frontend
#### Built-in automatic dark mode
By default, the color scheme is defined by the system configuration.

This can be disabled by excluding the `/stylesheets/colors.css` file from your page.

#### Built-in CSS classes
All of these classes can be demoed using the `test-page.html` file, provided [here](https://github.com/NadavTasher/Webhood/blob/master/resources/tests/test-page.html) or [here (headless bundle)](https://github.com/NadavTasher/Webhood/blob/master/bundles/headless/test-page.html)

Row & Column (every `<div>` is a column by default):
```html
<div class="row">
	<button>Left Item</button>
	<button>Right Item</button>
</div>
<div class="column">
	<button>Top Item</button>
	<button>Bottom Item</button>
</div>
```

Left, Right & Center (every element is centered by default):
```html
<div class="row left">
	<button>Item</button>
</div>
<p class="right">This text is aligned to the right</p>
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
if (state.isDangerous)
	await alertDialog("The current conditions are dangerous. Take care!");
// ...
```

Confirm dialog:
```javascript
try {
	// Ask for user confirmation
	await confirmDialog("Are you sure you want to delete this item?");

	// Delete item
	await POST("/api/delete_item", { item });
} catch (e) {
	await alertDialog(e);
}
```

Prompt dialog:
```javascript
try {
	// Ask user for their name
	const name = await promptDialog("What is your name?", "Your name goes here");

	console.log(`User's name is ${name}`);
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
	age: age
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

### Configuration

## Quirks
### Creating an in-mem application
If you do not want to use the pre-bundled `fsdicts` library to create simple persistent storage, you might want to use a regular `dict()` as a way to temporarly store globals.

To make this possible, you might need to extend the `entrypoint` configuration to tell `gunicorn` to only spawn a single worker. That way all of the requests will be handled by the same process with the same globals.

## Contributing
Contributions are highly encouraged through pull-requests or issues, mail me at [hey@nadav.app](mailto:hey@nadav.app) if needed.