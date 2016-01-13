var fs = require('fs');
var assert = require('assert');
var process = require('process');
var zlib = require('zlib');

function pages(path, response, data) {
    console.log("Handling 'page' request for " + path + ".");

    //reads a local html file into memory to send back to the client
    /*
     NOTICE: readFile is an async function, we pass it a callback to
     be executed by the node thread after it has finished running
     its i/o operation on its own thread
     */
    var file = fs.readFile(__dirname + path, function (err, data) {
        if (err) {
            console.error(err);
            response.writeHead(418, {"Content-Type": "text/plain"});
            response.write("There was an error loading the page.");
            response.end();
        }
        else {
            if (path.search("pages") !== -1) response.writeHead(200, {"Content-Type": "text/html"});
            else if (path.search("css") !== -1) response.writeHead(200, {"Content-Type": "text/css"});
            else if (path.search("js") !== -1) response.writeHead(200, {"Content-Type": "application/javascript"});
            else response.writeHead(200, {"Content-Type": "image/x-icon"});
            response.write(data.toString());
            response.end();
        }
    });
}

function media(path, response) {
    console.log("Handling media request for " + path + ".");

    var gzip = zlib.createGzip();
    response.writeHead(200, {"Content-Type":"image/png", "Content-Encoding":"gzip"});

    fs.createReadStream(__dirname + path, {
        'bufferSize': 4 * 1024
    }).on('error', function(err) {
        console.error(err);
    }).pipe(gzip).pipe(response);
}

function findEvents(response, data, db, ip) {
    console.log("Handling 'find' request.");

    //extract JSON data
    var params = JSON.parse(data);
    console.log(params);

    var radius = params["radius"] / 3963.2;

    //basic search criteria
    var criteria = {"location":
                    {$geoWithin:
                     { $centerSphere: [ [ params["lng"], params["lat"] ] , radius ] }
                    }
                   };
    //added search criteria
    for (criterion in params["criteria"]) {
        criteria.criterion = params["criteria.criterion"];
    }

    //query db
    var cursor = db.collection('events').find(criteria).limit(20).toArray(function(err,docs) {
        if(err) {
            response.writeHead(418, {"Content-Type": "application/json"});
            response.write(JSON.stringify({"Response":"No events"}));
            response.end();
        }
        else {
            var resText = {"hits": docs};
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(JSON.stringify(resText));
            response.end();
        }
    });
};


function createEvent(response, data, db, ip) {
    console.log("Handling 'create' request.");
    var params = JSON.parse(data);
    console.log(params);

    db.collection('events').find({"title": params["title"]}).toArray(function(err, docs) {

        console.log(docs.length);

        if (docs.length > 0) {
            //respond
            response.writeHead(418, {"Content-Type": "application/json"});
            response.write(JSON.stringify({"Response":"The event already exists."}));
            response.end();
        }

        else{
            db.collection('events').insertOne( params,
                                               function(err, result) {
                                                   if (err) {
                                                       console.error(err);
                                                       response.writeHead(418, {"Content-Type": "application/json"});
                                                       response.write(JSON.stringify({"Response":"Error inserting event."}));
                                                       response.end();
                                                   }
                                                   else {
                                                       //respond
                                                       response.writeHead(200, {"Content-Type": "application/json"});
                                                       response.write(JSON.stringify({"Response":"Success!"}));
                                                       response.end();
                                                   }
                                               }
                                             );
        }
    });
}

function deleteEvent(response, data, db, ip) {
    console.log("Handling 'delete' request.");
    var params = JSON.parse(data);

    db.collection('events').deleteOne( {"title": params["title"]},
                                            function(err, results) {
                                                if (err) {
                                                    response.writeHead(418, {"Content-Type": "application/json"});
                                                    response.write(JSON.stringify({"Response":"Error deleting event"}));
                                                    response.end();
                                                }
                                                else {
                                                    console.log(results);

                                                    //respond
                                                    response.writeHead(200, {"Content-Type": "application/json"});
                                                    response.write(JSON.stringify({"Response":"Success!"}));
                                                    response.end();
                                                }
                                            }
                                          );
}

function editEvent(response, data, db, ip) {
    console.log("Handling 'edit' request.");
    var params = JSON.parse(data);

    db.collection('events').updateOne({"title":params["title"]},
                                      params,
                                      function(err, results) {
                                          if(err) {
                                              response.writeHead(418, {"Content-Type": "application/json"});
                                              response.write(JSON.stringify({"Response":"Error editing event"}));
                                              response.end();
                                          }
                                          else {
                                              console.log(results);
                                              response.writeHead(200, {"Content-Type": "application/json"});
                                              response.write(JSON.stringify({"Response":"Success!"}));
                                              response.end();
                                          }
                                      });
}

function userIsGoing(response, data, db, ip) {
    console.log("User vote from " + ip + ".");
    var params = JSON.parse(data);

    db.collection("events").updateOne({"title":params["title"]},
                                      {"$inc":{"going": 1},"$push":{"usersGoing":ip}},
                                      function(err, results) {
                                          if(err) {
                                              response.writeHead(418, {"Content-Type": "application/json"});
                                              response.write(JSON.stringify({"Response":"Error editing event"}));
                                              response.end();
                                          }
                                          else {
                                              console.log(results);
                                              response.writeHead(200, {"Content-Type": "application/json"});
                                              response.write(JSON.stringify({"Response":"Success!"}));
                                              response.end();
                                          }
                                      });
}

exports.media = media;
exports.going = userIsGoing;
exports.pages = pages;
exports.findEvents = findEvents;
exports.editEvent = editEvent;
exports.deleteEvent = deleteEvent;
exports.createEvent = createEvent;
