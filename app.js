var express = require('express');

var app = express();

app.get('/', function(req, res) {
  console.log("Oh hai");
  res.send("What up");
});

app.get('/party/:id', function(req, res) {
  console.log("Oh hai");
  res.send("What up");
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});