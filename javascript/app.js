function load() {
}

function worker(){
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register("worker.js").then((result)=>{});
    }
}