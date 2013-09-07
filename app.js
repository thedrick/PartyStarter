var express = require('express');

var app = express();
var mongo = require('mongodb');
var client;

app.use(express.bodyParser());

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

mongo.Db.connect(mongoUri, function (err, db) {
  client = db;
});

app.get('/', function(req, res) {
  console.log("Oh hai");
  res.send("What up");
});

app.get('/party/:id', function(req, res) {
  console.log("Oh hai");
  res.send("What up");
});

app.post("/parties", function(req, res) {
  var name = req.body.name;
  var location = req.body.location;
  var date = req.body.date;
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});