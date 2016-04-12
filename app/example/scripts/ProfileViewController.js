angular
    .module('example')
    .controller('ProfileController', ['$scope', 'supersonic', function($scope, supersonic) {
    // Refreshes the page and grabs new purchase data from firebase
    $scope.doRefresh = function() {
        supersonic.logger.log('test');
        supersonic.logger.log($scope.userdata);
        $scope.userData = JSON.parse(window.localStorage.getItem('userData'));
        $scope.$apply();
    }
    $scope.doRefresh();
    $scope.$apply();
}]);
