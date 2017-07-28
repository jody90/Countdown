var path         = require('path');
var fs           = require('fs');
var q            = require("q");
var WatchJS      = require("watchjs")
var watch        = WatchJS.watch;
var unwatch      = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
var express      = require('express');
var http         = require('http');
var app          = express();
var server       = http.createServer(app);
var io           = require('socket.io').listen(server);

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

    // Send all availableCountdowns to the connected Client
    socket.emit('availableCountdowns', countdowns);

    socket.on('startCountdown', function (data) {
        var countdownId = data.countdownId;
        startCountdown(countdownId);
        // console.log(data);
    });

    watch(countdowns, function(){
        console.log("changed: ", countdowns.counter_0.currentState);
        socket.broadcast.emit('availableCountdowns', countdowns);
    });

});

var countdowns = {
    "counter_0": {
        id: "counter_0",
        name: "Countdown 0",
        duration: 180,
        currentState: '',
    },
    "counter_1": {
        id: "counter_1",
        name: "Countdown 1",
        duration: 360,
        currentState: '',
    }
};

var timer = {};

var startCountdown = function(id) {
    countdowns[id].currentState = countdowns[id].currentState || countdowns[id].duration;
    timer[id] = setInterval(function() {
        countdowns[id].currentState = countdowns[id].currentState - 1;
    }, 60000);
}

// Routing
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/layout.html'));
})

var port = 4500;
server.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})
