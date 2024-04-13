window.addEventListener("load", async function () {
	// Load existing posts
	const currentPosts = await call("/api/posts");

	// Append all posts
	for (const post of currentPosts) {
		insertPost(post);
	}

	// Set the click listener
	$("#post").addEventListener("click", async () => {
		try {
			// Post the message
			await progressScreen("Posting message", call("/api/post", { message: $("#message").read() }));
		} catch (error) {
			// Display error
			await alertDialog(error);
		}
	});

	// Create the websocket
	socket("/socket/posts", (message) => {
		// Insert the post
		insertPost(JSON.parse(message));

		// Scroll the messages
		$("#wall").scrollTo(0, $("#wall").scrollHeight);
	});
});

function insertPost(post) {
	// Untuple the post
	const [timestamp, message] = post;

	// Create the post element
	const postElement = $("#item").populate({ timestamp: timestamp, message: message });

	// Append the element to the page
	$("#wall").appendChild(postElement);
}
