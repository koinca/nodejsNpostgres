var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var pg = require('pg');

var conString = "pg://username:password@hostip:5432/dbname";
var client = new pg.Client(conString);
client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes/routes.js")(app, client);


var server = app.listen(3001, function () {
    console.log("Listening on port %s...", server.address().port);
});
