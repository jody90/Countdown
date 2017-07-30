myApp.controller('DashboardController', ['$scope', '$rootScope', '$location', '$timeout', function($scope, $rootScope, $location, $timeout) {

    $('#adminPasswordModal').on('hidden.bs.modal', function (e) {
        $scope.password = "";
    })

    $scope.doAdminAction = function(password) {
        if ($rootScope.meta.passwords.admin == password) {
            $scope.password = "";
            $('#adminPasswordModal').modal('hide');

            // wait for animation ended
            $timeout(function() {
                console.log("redirect");
                $location.path("/admin");
            }, 250);
        }
        else {
            $scope.passwordWrong = true;
        }
    }

    $scope.askPassword = function(type) {
        $('#adminPasswordModal').modal('show');
        $scope.askPasswordType = type;
    }


}])
