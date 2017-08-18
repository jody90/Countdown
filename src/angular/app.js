var myApp = angular.module('MyApp', ['ngRoute', 'angular-svg-round-progressbar']);

myApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/dashboard.html",
        controller : "DashboardController"
    })
    .when("/countdown/:countdownId", {
        templateUrl : "templates/countdown.html",
        controller : "CountdownController"
    })
    .otherwise({redirectTo: "/"});
})

myApp.run(['$rootScope', '$location', '$routeParams', 'socket', function($rootScope, $location, $routeParams, socket) {
    
    $rootScope.mutedCountdowns = JSON.parse(localStorage.getItem("mutedCountdowns")) || [];
    
    socket.on('availableCountdowns', function(data) {
        $rootScope.countdowns = data;
        $rootScope.countdownsArray = Object.keys($rootScope.countdowns).map(function(key) {
            return $rootScope.countdowns[key];
        });
        
        console.log("$rootScope.arrFromMyObj: ", $rootScope.arrFromMyObj);
    })
    
    socket.on('rooms', function(data) {
        $rootScope.rooms = data;
    })
    
    socket.on('meta', function(data) {
        $rootScope.meta = data;
    })
    
    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
        $rootScope.currentPath = $location.path();
        
        $rootScope.currentCountdownId = $routeParams.countdownId;
        
        if ($rootScope.currentPath == "/") {
            $rootScope.headerText = "Countdown Manager";
        }
        else if ($rootScope.currentPath.indexOf("/countdown/") != -1) {
            $rootScope.headerText = undefined;
        }
        
        $('.navbar-collapse').collapse('hide');
        
    });
    
    
}]);

myApp.factory('socket', function ($rootScope) {
    console.log($("base").attr("href"));
    if ($("base").attr("href") == "/") {
        var socket = io.connect();
    }
    else {
        var socket = io.connect('http://zusappcenter1.sortimo.de', {path: "/countdown/socket.io"});
    }
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
