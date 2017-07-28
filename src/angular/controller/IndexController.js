myApp.controller('IndexController', ['$scope', 'socket', function($scope, socket) {

    // var socket = io('http://localhost:4500');
    // socket.on('countdown', function (data) {
    //     console.log(data);
    //     socket.emit('my other event', { my: 'data' });
    // });

    $scope.countdowns;

    socket.on('availableCountdowns', function (data) {
        $scope.countdowns = data;
    });

    $scope.startCountdown = function(countdownId) {
        console.log("Start: ", countdownId);
        socket.emit("startCountdown", {countdownId: countdownId});
    }

    $scope.resetCountdown = function(countdownId) {
        console.log("Reset: ", countdownId);
        socket.emit("resetCountdown", {countdownId: countdownId});
    }

    $scope.pauseCountdown = function(countdownId) {
        console.log("Pause: ", countdownId);
        socket.emit("pauseCountdown", {countdownId: countdownId});
    }

}])
