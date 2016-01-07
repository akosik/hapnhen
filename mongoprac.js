var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    /*insertDocument(db, function() {
      db.close();
    });
    findRestaurants(db, function() {
      db.close();
    });*/
    aggregateRestaurants(db, function() {
      db.close();
    });/*
    updateRestaurants(db, function() {
      db.close();
    });
    removeRestaurants(db, function() {
      db.close();
    });
    */
});

//INSERT
var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback(result);
  });
};


//FIND
var findRestaurants = function(db, callback) {
    var cursor = db.collection('restaurants').find({'borough':'Manhattan'});
    cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

//AGGREGATE
var aggregateRestaurants = function(db, callback) {
   db.collection('restaurants').aggregate(
     [
       { $match: { "borough": "Queens", "cuisine": "Brazilian" } },
       { $group: { "_id": "$address.zipcode" , "count": { $sum: 1 } } }
     ]).toArray(function(err, result) {
       assert.equal(err, null);
       console.log(result);
       callback(result);
     }
   );
};

//UPDATE
var updateRestaurants = function(db, callback) {
   db.collection('restaurants').updateOne(
      { "name" : "Juni" },
      {
        $set: { "cuisine": "American (New)" },
        $currentDate: { "lastModified": true }
      }, function(err, results) {
      console.log(results);
      callback();
   });
};

//DELETE
var removeRestaurants = function(db, callback) {
   db.collection('restaurants').deleteMany(
      { "borough": "Manhattan" },
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};
