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

var passwordsFs = fs.readFileSync(__dirname + '/storage/passwords.json');
var passwords = JSON.parse(passwordsFs);

var countdownsStorageFs = fs.readFileSync(__dirname + '/storage/countdowns.json');
var countdownsStorage = JSON.parse(countdownsStorageFs);
var countdowns = countdownsStorage;

// console.log(countdowns);

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

io.on('connection', function (socket) {

    watch(countdowns, function(){
        // console.log("changed: ", countdowns);
        socket.broadcast.emit('availableCountdowns', countdowns);
    });

    socket.emit('availableCountdowns', countdowns);

    socket.emit('meta', {passwords: passwords});

    socket.broadcast.emit('test', {jody: "test"});
    socket.on('saveCountdowns', function(data) {

        fs.writeFile(__dirname + "/storage/countdowns.json", JSON.stringify(data), { flag: 'w' }, function(err) {
            if(err) {
                return console.log(err);
            }
            countdowns = data;

            socket.broadcast.emit('availableCountdowns', countdowns);

            console.log("The file was saved!");
        });
    })

    socket.on('startCountdown', function (data) {
        var countdownId = data.countdownId;
        startCountdown(countdownId);
    });

    socket.on('pauseCountdown', function (data) {
        var countdownId = data.countdownId;
        pauseCountdown(countdownId);
    });

    socket.on('resetCountdown', function (data) {
        var countdownId = data.countdownId;
        resetCountdown(countdownId);
    });

    socket.on('getCountdowns', function (data) {
        socket.emit('availableCountdowns', countdowns);
    });

    socket.on('adminGetCountdowns', function (data) {
        socket.emit('requestedCountdowns', countdowns);
    });
});

var timer = {};

var startCountdown = function(id) {
    countdowns[id].currentState = countdowns[id].currentState || countdowns[id].duration;
    timer[id] = setInterval(function() {
        if (countdowns[id].currentState - 1 > 0) {
            countdowns[id].currentState = countdowns[id].currentState - 1;
        }
        else {
            countdowns[id].currentState = 0;
            clearInterval(timer[id]);
        }
    }, 300); // 60000 one minute
}

var pauseCountdown = function(id) {
    clearInterval(timer[id]);
}

var resetCountdown = function(id) {
    clearInterval(timer[id]);
    countdowns[id].currentState = countdowns[id].duration;
}

var port = 4500;
server.listen(port, function() {
    console.log('Node.js listening on port ' + port)
})
