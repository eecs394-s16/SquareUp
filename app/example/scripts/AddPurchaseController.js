angular
    .module('example')
    .controller('AddPurchaseController', ['$scope', 'supersonic', function($scope, supersonic) {
        $scope.navbarTitle = "Add a Purchase";

        $scope.squareUp = function() {
            var options = {
              message: "A longer message with \n\n\n\nmultiple lines.",
              buttonLabel: "Close"
            };

            supersonic.ui.dialog.alert("Custom title!", options).then(function() {
              supersonic.logger.log("Alert closed.");
            });
        }

        $scope.addPerson = function() {
            var myEl = angular.element( document.querySelector( '.list-people' ) );
            myEl.append('<label class="item item-input"><span class="input-label">Share With:</span><input type="text" placeholder="Who are you sharing it with?"></label>');
        }
    }]);
