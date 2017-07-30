myApp.controller('CountdownController', ['$scope', '$rootScope', 'socket', '$routeParams', function($scope, $rootScope, socket, $routeParams) {

    var countdownId = $rootScope.currentCountdownId;
    var nowSayedState;
    var scopeChanged = false;

    $scope.isCountdownMuted = $rootScope.mutedCountdowns.indexOf($rootScope.currentCountdownId) != -1 ? true : false;

    $rootScope.$watch("countdowns", function(newValue, oldValue) {
        if (newValue != undefined) {
            $scope.countdown = newValue[$rootScope.currentCountdownId];
        }
    });

    $scope.$watch("countdown", function(newValue, oldValue) {
        if (newValue != undefined) {

            scopeChanged = true;

            if (newValue.sayTime.indexOf(newValue.currentState) > -1) {

                var countdownCurrentState = newValue.id + "_" + newValue.currentState;

                if (nowSayedState != countdownCurrentState) {

                    nowSayedState = countdownCurrentState;

                    var text = "Es verbleiben noch " + newValue.currentState + " Minuten."
                    if (!$scope.isCountdownMuted) {
                        speak(text);
                    }
                }
            }
        }
    });


    $scope.doRestrictedAction = function(type, password) {
        $('#passwordModal').modal('show')
    }

    $scope.startCountdown = function(countdownId) {
        scopeChanged = false ;
        socket.emit("startCountdown", {countdownId: countdownId});

        // Workaround
        // reload page if there is no scope change after starting the countdown
        // sometimes scope does not recognize change
        setTimeout(function() {
            if (!scopeChanged) {
                location.reload();
            }
        }, 1000)
    }

    $('#passwordModal').on('hidden.bs.modal', function (e) {
        $scope.password = "";
    })

    $scope.doRestrictedAction = function(type, password, currentCountdownId) {
        if ($rootScope.meta.passwords[type] == password) {
            switch (type) {
                case "reset" :
                    $scope.password = "";
                    $scope.resetCountdown(currentCountdownId);
                    $('#passwordModal').modal('hide');
                break;
            }
        }
        else {
            $scope.passwordWrong = true;
        }
    }

    $scope.askPassword = function(type) {
        $('#passwordModal').modal('show');
        $scope.askPasswordType = type;
    }

    $scope.pauseCountdown = function(countdownId) {
        socket.emit("pauseCountdown", {countdownId: countdownId});
    }

    $scope.resetCountdown = function(countdownId) {
        socket.emit("resetCountdown", {countdownId: countdownId});
    }

    $scope.muteCountdown = function(countdownId) {
        var index = $rootScope.mutedCountdowns.indexOf(countdownId);

        if (index != -1) {
            $rootScope.mutedCountdowns.splice(index, 1);
            $scope.isCountdownMuted = false;
        }
        else {
            $rootScope.mutedCountdowns.push(countdownId);
            $scope.isCountdownMuted = true;
        }
        // Store
        localStorage.setItem("mutedCountdowns", JSON.stringify($rootScope.mutedCountdowns));
    }

    if ('speechSynthesis' in window) {

        var voice;

        setTimeout(function() {
            var voices = window.speechSynthesis.getVoices();
            for (var i = 0; i < voices.length; i++) {
                if (voices[i].lang == "de-DE") {
                    voice = voices[i];
                }
            }
        }, 250)

        function speak(text) {

            var msg = new SpeechSynthesisUtterance();

            msg.voice = voice;
            msg.rate = 1;
            msg.pitch = 1;
            msg.text = text;

            speechSynthesis.speak(msg);
        }
    }
    else {
        console.error("Browser does not support speechSynthesis!");
    }


}])
