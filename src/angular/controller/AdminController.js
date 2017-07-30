myApp.controller('AdminController', ['$scope', '$rootScope', 'socket', function($scope, $rootScope, socket) {

    socket.emit('adminGetCountdowns');

    $scope.adminCountdowns = [];

    socket.on('requestedCountdowns', function(data) {
        // $scope.adminCountdowns = data;
        for (countdown in data) {
            $scope.adminCountdowns.push(data[countdown]);
        }
    })

    $scope.$watch("adminCountdowns", function(newValue, oldValue) {
        if (newValue != undefined) {
            console.log(newValue);
        }
    });

    $scope.save = function(data) {
        // console.log("data: ", data);

        for (var i = 0; i < $scope.adminCountdowns.length; i++) {
            if ($scope.adminCountdowns[i].id == data.id) {
                $scope.adminCountdowns[i] = data;
            }
        }

        sendSave();
    }

    socket.on('test', function(data) {
        // $rootScope.countdowns = data;
        console.log("data", data);
    })

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
            countdownsObject[$scope.adminCountdowns[i].id] = $scope.adminCountdowns[i];
        }
        // console.log("countdownId: ", countdownId);
        socket.emit('saveCountdowns', countdownsObject);
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
