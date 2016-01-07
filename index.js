//require certain modules
var server = require('./server');
var router = require('./router');
var rHs = require('./requestHandlers');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//handleDict is used for routing requests to their respective handlers
var handleDict = {};
handleDict['/findEvents'] = rHs.findEvents;
handleDict['/createEvent'] = rHs.createEvent;
handleDict['/editEvent'] = rHs.editEvent;
handleDict['/deleteEvent'] = rHs.deleteEvent;

//database url
var url = 'mongodb://akosik:epsilon0@ds037415.mongolab.com:37415/events';

//the beginning of it all
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    server.start(router.route, handleDict, db);
});
