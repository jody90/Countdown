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

var countdowns = {};

if (fs.existsSync(__dirname + '/storage/countdowns.json')) {
    let countdownsStorageFs = fs.readFileSync(__dirname + '/storage/countdowns.json');
    let countdownsStorage = JSON.parse(countdownsStorageFs);
    countdowns = countdownsStorage;
}

app.use('/css', express.static(__dirname + '/ressources/css'));
app.use('/angular', express.static(__dirname + '/ressources/angular'));
app.use('/images', express.static(__dirname + '/ressources/images'));
app.use('/templates', express.static(__dirname + '/src/templates'));
app.use('/scripts', express.static(__dirname + '/ressources/js'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Routing
app.get('/', function(req, res) {
    if (process.env.NODE_ENV == "production") {
        res.sendFile(path.join(__dirname + '/views/layout_production.html'));
    }
    else {
        res.sendFile(path.join(__dirname + '/views/layout.html'));
    }
})

var getRooms = function(countdowns, callback) {

    var rooms = [];
    
    for (var i in countdowns) {
        if (rooms.indexOf(countdowns[i].room) == -1) {
            rooms.push(countdowns[i].room);
        }
    }
    
    return callback(rooms);
}

io.on('connection', function (socket) {

    watch(countdowns, function(){
        // console.log("changed: ", JSON.stringify(countdowns));
        socket.broadcast.emit('availableCountdowns', countdowns);

        fs.writeFile(__dirname + "/storage/countdowns.json", JSON.stringify(countdowns), { flag: 'w' }, function(err) {
            if(err) {
                return console.log(err);
            }
        });

    }, 50, true);

    socket.emit('availableCountdowns', countdowns);
    
    getRooms(countdowns, function(rooms) {
        socket.emit('rooms', rooms);
    });

    socket.emit('meta', {passwords: passwords});

    socket.on('saveCountdown', function(data) {

        if (countdowns[data.id] === undefined) {
            countdowns[data.id] = data;
        }
        else {
            for (var countdown in countdowns) {
                if (countdowns[countdown].id == data.id) {                
                    countdowns[countdown] = data;
                }
            }
        }

        fs.writeFile(__dirname + "/storage/countdowns.json", JSON.stringify(countdowns), { flag: 'w' }, function(err) {
            if(err) {
                return console.log(err);
            }
            
            socket.broadcast.emit('availableCountdowns', countdowns);
            
        });
    })
    
    socket.on('deleteCountdown', function(data) {

        if (countdowns[data.id] !== undefined) {
            delete countdowns[data.id];
        }

        fs.writeFile(__dirname + "/storage/countdowns.json", JSON.stringify(countdowns), { flag: 'w' }, function(err) {
            if(err) {
                return console.log(err);
            }
            else {
                console.log(data);
                socket.broadcast.emit('availableCountdowns', countdowns);
            }
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
    console.log("startCountdown: ", id + " Uhrzeit: " + new Date() + " currentState: " + countdowns[id].currentState);
    
    countdowns[id].startTime = Date.now();
    
    timer[id] = setInterval(function() {

        // console.log("difference ["+id+"]: ", Date.now() - countdowns[id].startTime);
        
        if (Date.now() - countdowns[id].startTime > 59900) {
            countdowns[id].startTime = Date.now();
            
            if (countdowns[id].currentState - 1 > 0) {
                countdowns[id].currentState = countdowns[id].currentState - 1;
                // console.log("if intervalCountdown: ", id + " Uhrzeit: " + new Date() + " currentState: " + countdowns[id].currentState);
            }
            else {
                countdowns[id].currentState = 0;
                // console.log("else intervalCountdown: ", id + " Uhrzeit: " + new Date() + " currentState: " + countdowns[id].currentState);
                clearInterval(timer[id]);
            }
        }



    }, 100); // 60000 one minute
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
