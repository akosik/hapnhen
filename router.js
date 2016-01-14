var pages = require('./requestHandlers').pages;
var media = require('./requestHandlers').media;


//continued from the server module call
function route(path, response, handleDict, data, db, ip) {
    console.log("Routing request for " + path);

    if (path === "/") pages("/pages/mapPage.html", response);

    else if (path.search(/pages|js|css|favicon/) !== -1) pages(path, response);

    else if (path.search(/img/) !== -1) media(path, response);

    //checks to make sure requested path corresponds to one of the functions we offer
    //if it does, execute the function
    else if (handleDict !== undefined && typeof handleDict[path] === 'function') handleDict[path](response, data, db, ip);
    //if it doesn't, respond with 404
    else {
        console.log("Missing request handler for " + path);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write('404 Not Found');
        response.end();
    }
}

exports.route = route;
