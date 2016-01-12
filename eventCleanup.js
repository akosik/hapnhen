#!/usr/bin/env node
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://akosik:epsilon0@ds037415.mongolab.com:37415/events';

//the beginning of it all
MongoClient.connect(url, function(err, db) {
    var day = 24 * 60 * 60 * 1000;
    var date = new Date();
    var current_time = date.getTime();
    db.collection("events").deleteMany({'startTime':{'$lte':current_time - day}},
                                       function(err,results) {
                                           if(err) console.error(err);
                                           else console.log(results);
                                       });
});
