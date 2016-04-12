angular
.module('example')
.controller('LoginViewController', ['$scope', 'supersonic', '$firebaseAuth', function($scope, supersonic, $firebaseAuth) {
    $scope.moveOn = function() {
        var animation = supersonic.ui.animate("flipHorizontalFromRight");
        supersonic.ui.initialView.dismiss(animation);
    }

    $scope.Auth = function() {
        var ref = new Firebase('https://squareup-split.firebaseio.com/users');
        return $firebaseAuth(ref);
    }
    $scope.loginFB = function() {
        supersonic.bind($scope, 'userData'); // bind userData in superscope
        var ref = new Firebase('https://squareup-split.firebaseio.com');
        var userRef = new Firebase('https://squareup-split.firebaseio.com/users');
        ref.authWithOAuthPopup("facebook", function(err, authData) {
            if (err) {
                supersonic.logger.log("login failed! with err" + err);
            } else {
                supersonic.logger.log("Authenticated successfully !!");
                $scope.userData = authData;
                userRef.push(authData);
                window.localStorage.setItem('userData', JSON.stringify(authData));
                $scope.moveOn();
            }
        });
    }
    $scope.login = function() {
        var Auth = new Firebase('https://squareup-split.firebaseio.com/users');
        Auth.authWithPassword({
            username: $scope.data.username,
            password: $scope.data.password
        }).then(function(authData) {
            $scope.moveOn();
        }).catch(function(error) {
            var options = {
                message: err,
                buttonLabel: "Ok"
            };
            supersonic.ui.dialog.alert("Failed to Login", options).then(function() {
                supersonic.logger.log("Alert closed.");
            });
        });
    }
    $scope.signup = function() {
        supersonic.logger.log("clicked signed up");
        var Auth = $scope.Auth();
        Auth.createUser({
            email: $scope.data.email,
            password: $scope.data.password,
        }).then(function(userData) {
            supersonic.logger.log("made user");
            $scope.usersRef.child(userData.uid).set({
                provider: 'password',
                username: $scope.data.username,
            });
            $scope.login();
        }).catch(function(err) {
            supersonic.logger.log("error");
            var options = {
                message: err,
                buttonLabel: "Ok"
            };
            supersonic.ui.dialog.alert("Failed to Sign Up", options).then(function() {
                supersonic.logger.log("Alert closed.");
            });
        });
        supersonic.logger.log("done");
    }
}]);
