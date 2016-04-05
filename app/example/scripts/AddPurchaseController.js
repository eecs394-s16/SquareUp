angular
    .module('example')
    .controller('AddPurchaseController', function($scope, supersonic) {
        $scope.navbarTitle = "Add a Purchase";

        $scope.addPersonTextBox = function() {
            console.log("testing add person box");
            $('.list-people').append($compile('<label class="item item-input"><span class="input-label">Price</span><input type="text" placeholder="How much was it?"></label>')(scope));
            scope.$apply();
        }



    });
