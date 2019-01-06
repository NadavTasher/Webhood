function load() {
    // Register Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("worker.js").then((result)=>{});
    }
}