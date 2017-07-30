myApp.controller('DashboardController', ['$scope', '$rootScope', '$location', '$timeout', function($scope, $rootScope, $location, $timeout) {

    $('#adminPasswordModal').on('hidden.bs.modal', function (e) {
        $scope.password = "";
    })

    $scope.doAdminAction = function(password) {
        if ($rootScope.meta.passwords.admin == password) {
            $scope.password = "";
            $('#adminPasswordModal').modal('hide');

            localStorage.setItem("isLoggedIn", true);
            $rootScope.isLoggedIn = true;

            // wait for animation ended
            $timeout(function() {
                $location.path("/admin");
            }, 250);
        }
        else {
            $scope.passwordWrong = true;
        }
    }

    $scope.askPassword = function(type) {
        if ($rootScope.isLoggedIn) {
            $location.path("/admin");
        }
        else {
            $('#adminPasswordModal').modal('show');
            $scope.askPasswordType = type;
        }
    }

    $scope.logout = function() {
        console.log("logout");
        localStorage.setItem("isLoggedIn", false);
        $rootScope.isLoggedIn = false;
        $location.path("/");
    }

}])
