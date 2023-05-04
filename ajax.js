function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL : " + url);
    });
    req.send(null);
}


function ajaxPost(url, data, callback, isJson) {
    var req = new XMLHttpRequest();
    req.open("POST", url);
    
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l' URL " + url);
    });
    
    if (isJson) {
        req.setRequestHeader("Content-Type", "application/json");
        data = JSON.stringify(data);
    }
    req.send(data);
}