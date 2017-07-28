var myApp = angular.module('MyApp', ['ngRoute']);

myApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/index.html",
        controller : "IndexController"
    })
    .otherwise({redirectTo: "/"});
})



myApp.run(['$rootScope', '$location', '$routeParams', function($rootScope, $location, $routeParams) {

    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
        $rootScope.currentPath = $location.path();

        switch ($rootScope.currentPath) {
            case "/" :
            $rootScope.headerText = "Index Page";
            break;
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
