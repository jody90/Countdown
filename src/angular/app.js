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
    .when("/admin", {
        templateUrl : "templates/admin.html",
        controller : "AdminController"
    })
    .otherwise({redirectTo: "/"});
})

myApp.run(['$rootScope', '$location', '$routeParams', 'socket', function($rootScope, $location, $routeParams, socket) {

    $rootScope.mutedCountdowns = JSON.parse(localStorage.getItem("mutedCountdowns")) || [];

    socket.on('availableCountdowns', function(data) {
        $rootScope.countdowns = data;
        console.log("availableCountdowns", $rootScope.countdowns);
    })

    socket.on('test', function(data) {
        // $rootScope.countdowns = data;
        console.log("data", data);
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
        else if ($rootScope.currentPath == "/admin") {
            $rootScope.headerText = "Admin Bereich";
        }
        $('.navbar-collapse').collapse('hide');

    });

}]);

myApp.factory('socket', function ($rootScope) {
    var socket = io.connect();
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
