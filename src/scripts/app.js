function load() {
    // App Load Code
    Module.load("API", "UI", "Authenticate").then(() => {
        Authenticate.initialize().then(() => {
            console.log("Logged In");
        });
    });
}

// App Code