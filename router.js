var pages = require('./requestHandlers').pages;

//continued from the server module call
function route(path, handleDict, response, data, db) {
    console.log("Routing request for " + path);

    if (path === "/") pages("/pages/mapPage.html", response, data, db);

    else if (path.search(/pages|js|css|favicon/) !== -1) pages(path, response, data, db);

    //checks to make sure requested path corresponds to one of the functions we offer
    //if it does, execute the function
    else if (typeof handleDict[path] === 'function') handleDict[path](response, data, db);
    //if it doesn't, respond with 404
    else {
        console.log("Missing request handler for " + path);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write('404 Not Found');
        response.end();
    }
}

exports.route = route;
