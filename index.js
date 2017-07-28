var path    = require('path');
var fs      = require('fs');
var q       = require("q");
var express = require('express');
var http    = require('http');
var app     = express();
var server  = http.createServer(app);
var io      = require('socket.io').listen(server);

var passwords = {
    "reset" : "reset",
    "pause" : "pause"
};

var storageFs = fs.readFileSync(__dirname + '/storage/storage.json');
var storage = JSON.parse(storageFs);

app.use('/css', express.static(__dirname + '/ressources/css'));
app.use('/angular', express.static(__dirname + '/ressources/angular'));
app.use('/images', express.static(__dirname + '/ressources/images'));
app.use('/templates', express.static(__dirname + '/src/templates'));
app.use('/scripts', express.static(__dirname + '/ressources/js'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

console.log("storage: ", storage);

io.on('connection', function (socket) {
    socket.emit('availableCountdowns', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

var countdowns = [
    {
        name: "Countdown 1",
        duration: 180,
        currentState: '',
    },
    {
        name: "Countdown 2",
        duration: 360,
        currentState: '',
    }
];

// Routing
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/layout.html'));
})

var port = 4500;
server.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})
