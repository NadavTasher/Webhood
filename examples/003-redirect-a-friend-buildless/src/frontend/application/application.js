// Generate a random ID (used to not redirect ourselves)
const myID = Math.random().toString(16).substring(2);

window.addEventListener("load", async function () {
	// Set the click listener
	$("#button").addEventListener("click", async () => {
		await POST("/api/redirect", { id: myID, url: $("#url").read() });
	});

	// Open a websocket to handle redirects
	socket("/socket/redirect", (message) => {
		// Decode the message
		const object = JSON.parse(message);

		// Make sure the message is not ours
		if (object.id !== myID) {
			window.location = object.url;
		}
	});
});
