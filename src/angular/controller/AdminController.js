myApp.controller('AdminController', ['$scope', '$rootScope', '$location', 'socket', function($scope, $rootScope, $location, socket) {

    socket.emit('adminGetCountdowns');

    $scope.adminCountdowns = [];

    $scope.logout = function() {
        localStorage.setItem("isLoggedIn", false);
        $rootScope.isLoggedIn = false;
        $location.path("/");
    }

    socket.on('requestedCountdowns', function(data) {
        for (countdown in data) {
            $scope.adminCountdowns.push(data[countdown]);
        }
    })

    $scope.save = function(data) {

        for (var i = 0; i < $scope.adminCountdowns.length; i++) {
            if ($scope.adminCountdowns[i].id == data.id) {
                $scope.adminCountdowns[i] = data;
            }
        }
        sendSave();
    }

    $scope.delete = function(countdownId) {

        for (var i = 0; i < $scope.adminCountdowns.length; i++) {
            if ($scope.adminCountdowns[i].id == countdownId) {
                $scope.adminCountdowns.splice(i, 1);
            }
        }
        sendSave();
    }

    $scope.new = function() {
        var uuid = generateUUID();

        var obj = {
            id: uuid,
            name: "Neuer Timer",
            duration: "",
            currentState: "",
            dangerTimeLeft: "",
            sayTime: []
        };

        $scope.adminCountdowns.unshift(obj);
    }

    function sendSave() {
        var countdownsObject = {};

        for (var i = 0; i < $scope.adminCountdowns.length; i++) {
            
            // dont loose current state on save
            
            console.log("currentState: ", $rootScope.countdowns[$scope.adminCountdowns[i].id].currentState);
            
            $scope.adminCountdowns[i].currentState = $rootScope.countdowns[$scope.adminCountdowns[i].id].currentState;
            
            if (typeof $scope.adminCountdowns[i].sayTime == "string") {
                $scope.adminCountdowns[i].sayTime = $.map($scope.adminCountdowns[i].sayTime.split(","), function(value){
                    return parseInt(value);
                });
            }
            countdownsObject[$scope.adminCountdowns[i].id] = $scope.adminCountdowns[i];
        }

        socket.emit('saveCountdowns', countdownsObject);

        location.reload();
    }

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

}])
