angular
    .module('example')
    .controller('LoginViewController', ['$scope', 'supersonic', function($scope, supersonic) {
        $scope.moveOn = function() {
            var animation = supersonic.ui.animate("flipHorizontalFromRight");
            supersonic.ui.initialView.dismiss(animation);
        }
        $scope.login = function() {
            $scope.moveOn();
        }
}]);
