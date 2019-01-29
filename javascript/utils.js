function view(v) {
    let element = get(v);
    let parent = element.parentNode;
    for (let n = 0; n < parent.children.length; n++) {
        hide(parent.children[n]);
    }
    show(element);
}

function hide(v) {
    get(v).style.display = "none";
}

function show(v) {
    get(v).style.removeProperty("display");

}

function get(v) {
    return (typeof "" === typeof v || typeof '' === typeof v) ? document.getElementById(v) : v;
}

function clear(v) {
    let view = get(v);
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