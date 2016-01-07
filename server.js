var http = require('http');
var url = require('url');

//wrap server start in export function for use in main module: index.js
function start(route, handleDict, db) {
    //node.js way of starting an http server
    var server = http.createServer(function(request, response) {
        var data = "";
        //find pathname of request
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");

        //handle post versus get requests (put and delete are not supported on this server)
        if(request.method === "POST" || request.method === "GET") {

            request.setEncoding("utf8");

            /*
             calls 'on' function from request object
             'on' is an alias for 'addListener'
             these 3 lines tell node what do when the 'error', 'data', and 'end' events fire
             */
            request.on("error", function(error) {
                console.err(error);
            }).on("data", function(dataChunk) {
                data += dataChunk;
                console.log("Recieved data chunk '" + dataChunk + "'.");
            }).on("end", function() {
                //once the post body has been recieved in its entirety, we call on our router module
                route(pathname, handleDict, response, data, db);
            });
        }
    });

    server.listen(3000);
    console.log('Server Started.');
}

exports.start = start;
