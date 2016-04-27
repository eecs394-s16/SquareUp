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

    $scope.login = function(authData) {
        var userRef = new Firebase('https://squareup-split.firebaseio.com/users');
        userRef.push(authData);
        window.localStorage.setItem('userData', JSON.stringify(authData));
        $scope.moveOn();
    }

    $scope.loginGoogle = function() {
        var ref = new Firebase('https://squareup-split.firebaseio.com');
        supersonic.logger.log("login with Google");
        ref.authWithOAuthPopup("google", function(err, authData) {
            if (error) {
                supersonic.logger.log("test");
            } else {
                supersonic.logger.log("Authenticated successfully with payload:", authData);
                $scope.login(authData);
            }
        });
    }
    $scope.loginFB = function() {
        supersonic.bind($scope, 'userData'); // bind userData in superscope
        var ref = new Firebase('https://squareup-split.firebaseio.com');
        ref.authWithOAuthPopup("facebook", function(err, authData) {
            if (err) {
                supersonic.logger.log("login failed! with err" + err);
            } else {

                supersonic.logger.log("authData.uid: " + authData.uid);

                var ref = new Firebase("https://squareup-split.firebaseio.com/profiles/"+ authData.uid);
                ref.on("value", function(dataSnapshot)
                       {
                           if(!dataSnapshot.exists())
                               {
                                   supersonic.logger.log("ref didn't exist 1");

                                   var user_data = {
                                       username: authData.facebook.displayName,
                                       purchases: null,
                                       friends: null
                                   };

                                   $scope.createProfile(authData,user_data);

                               }
                       });

                       supersonic.logger.log("login - before");
                       $scope.login(authData);
                       supersonic.logger.log("login - after");
            }
        });
    }

    $scope.emailLogin = function(){
        var ref = new Firebase('https://squareup-split.firebaseio.com');
        var user = {
            email: $scope.data.email,
            password: $scope.data.password
        };
        ref.authWithPassword(user,function(err,authData){
            if (err){
                var options = {
                    message: err.code,
                    buttonlabel: "OK"
                };
                supersonic.ui.dialog.alert("Could not log in.",options);
            } else {
                window.localStorage.setItem('userData', JSON.stringify(authData));
                $scope.moveOn();	
            }	    
        });
    }

    $scope.createProfile = function(authData, user_data) {

        var ref = new Firebase("https://squareup-split.firebaseio.com/profiles/"+ authData.uid);
        var name2id = new Firebase("https://squareup-split.firebaseio.com/name2id/"+user_data.username);

        name2id.set(authData.uid);
        ref.set(user_data);
    };

    $scope.signup = function() {
        var ref = new Firebase('https://squareup-split.firebaseio.com');
        supersonic.logger.log("signup here");
        var user = {
            email: $scope.data.email,
            password: $scope.data.password
        };

        ref.createUser(user,function(err,authData){

            if (err){
                var options = {
                    message: err.code,
                    buttonLabel: "OK"
                };
                supersonic.ui.dialog.alert("Error creating user",options);
            } else {

                supersonic.ui.dialog.alert("New user created!");

                var user_data = {
                    username: $scope.data.username,
                    email: $scope.data.email,
                    purchases: null,
                    friends: null
                };

                $scope.createProfile(authData, user_data);

                supersonic.ui.layers.pop();
            }
        });
    }
}]);
