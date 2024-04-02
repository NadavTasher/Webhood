window.addEventListener("load", async function () {
	await update();
});

async function update() {
	// Get current count from server
	const currentClicks = await call("count");

	// Update UI
	$("#count").write(`Clicks: ${currentClicks}`);
}

async function advance() {
	try {
		// Try advancing the counter
		await call("advance");

		// Update UI
		await update();
	} catch (error) {
		// Display the error
		await alertDialog(error);
	}
}
