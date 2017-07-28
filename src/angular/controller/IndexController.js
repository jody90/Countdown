myApp.controller('IndexController', ['$scope', 'socket', function($scope, socket) {

    // var socket = io('http://localhost:4500');
    // socket.on('countdown', function (data) {
    //     console.log(data);
    //     socket.emit('my other event', { my: 'data' });
    // });

    socket.on('availableCountdowns', function (data) {
        console.log("data: ", data);
        
    });

}])
