myApp.controller('DashboardController', ['$scope', '$rootScope', '$location', '$timeout', 'socket', function($scope, $rootScope, $location, $timeout, socket) {

    $scope.doRestrictedAction = function(type, password, currentCountdownId) {
        if ($rootScope.meta.passwords[type] == password) {
            switch (type) {
                case "config" :
                    $scope.password = "";
                    newCountdown();
                    $('#passwordModal').modal('hide');
                    $('#configModal').modal('show');
                break;
                case "delete" :
                    $scope.password = "";
                    $('#passwordModal').modal('hide');
                    socket.emit('deleteCountdown', {id : currentCountdownId});
                    location.reload();
                break;
            }
        }
        else {
            $scope.passwordWrong = true;
        }
    }

    $scope.save = function(countdown) {
        
        $scope.configCountdown.currentState = countdown.duration;
        
        if (typeof $scope.configCountdown.sayTime == "string") {
            $scope.configCountdown.sayTime = $.map(countdown.sayTime.split(","), function(value){
                return parseInt(value);
            });
        }
        socket.emit('saveCountdown', $scope.configCountdown);
        location.reload();
    }

    $scope.askPassword = function(type, countdownId) {
        $('#passwordModal').modal('show');
        $scope.askPasswordType = type;
        $scope.askPasswordCountdownId = countdownId;
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

    var newCountdown = function() {
        var uuid = generateUUID();

        $scope.configCountdown = {
            id: uuid,
            name: "Neuer Timer",
            duration: "",
            currentState: "",
            dangerTimeLeft: "",
            sayTime: []
        };

    }

}])
