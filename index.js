//require certain modules
var server = require('./server');
var router = require('./router');
var rHs = require('./requestHandlers');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const readline = require('readline');
const process = require('process');


//handleDict is used for routing requests to their respective handlers
var handleDict = {};
handleDict['/findEvents'] = rHs.findEvents;
handleDict['/createEvent'] = rHs.createEvent;
handleDict['/editEvent'] = rHs.editEvent;
handleDict['/vote'] = rHs.going;


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('Enter your MongoLab Username: ', function(answer) {
    var user = answer;
    console.log('Thank you for your valuable feedback:', answer);

    rl.question('Password: ', function(answer) {
        var psswd = answer;

        //database url
        var url = 'mongodb://' + user + ':' + psswd + '@ds037415.mongolab.com:37415/events';

        //the beginning of it all
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            server.start(router.route, handleDict, db);
        });
    });
});
