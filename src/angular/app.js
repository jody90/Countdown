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
