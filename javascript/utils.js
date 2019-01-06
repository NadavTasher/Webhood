function hide(v) {
    if (typeof "" === typeof v || typeof '' === typeof v) {
        get(v).style.display = "none";
    } else {
        v.style.display = "none";
    }
}

function show(v) {
    if (typeof "" === typeof v || typeof '' === typeof v) {
        get(v).style.removeProperty("display");
    } else {
        v.style.removeProperty("display");
    }
}

function get(id) {
    return document.getElementById(id);
}

function clear(view) {
    while (view.firstChild) {
        view.removeChild(view.firstChild);
    }
}

function title(title) {
    document.title = title;
}

function theme(color) {
    let meta = document.getElementsByTagName("meta")["theme-color"];
    if (meta !== undefined) {
        meta.content = color;
    } else {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = color;
        document.head.appendChild(meta);
    }

}

function worker(w = "worker.js") {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(w).then((result) => {
        });
    }
}