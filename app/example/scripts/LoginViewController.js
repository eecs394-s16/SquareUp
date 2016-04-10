angular
    .module('example')
    .factory('Auth', ['$firebaseAuth', function ($firebaseAuth) {
        return new Firebase('https://squareup-split.firebaseio.com/users');
    }])
    .controller('LoginViewController', ['$scope', 'supersonic', 'Auth', function($scope, supersonic, Auth) {
        $scope.moveOn = function() {
            var animation = supersonic.ui.animate("flipHorizontalFromRight");
            supersonic.ui.initialView.dismiss(animation);
        }
        $scope.login = function() {
            $scope.moveOn();
        }
    }]);
