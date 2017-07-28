var express    = require("express");
var app        = express();
var path       = require('path');
var fs         = require('fs');
var q          = require("q");

app.use('/css', express.static(__dirname + '/ressources/css'));
app.use('/angular', express.static(__dirname + '/ressources/angular'));
app.use('/images', express.static(__dirname + '/ressources/images'));
app.use('/templates', express.static(__dirname + '/src/templates'));
app.use('/scripts', express.static(__dirname + '/ressources/js'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Routing
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/layout.html'));
})

var port = 4500;
app.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})
