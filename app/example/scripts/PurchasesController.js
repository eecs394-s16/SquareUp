angular
    .module('example')
    .controller('PurchasesViewController', ['$scope', 'supersonic', function($scope, supersonic) {
        // Refreshes the page and grabs new purchase data from firebase
        $scope.doRefresh = function() {

            supersonic.logger.log("Refresh Called.");
            var PurchasesRef = new Firebase('https://squareup-split.firebaseio.com/purchases');

            PurchasesRef.on("value", function(snapshot) {
                var allPurchases = snapshot.val();
                $scope.purchases = allPurchases;
            });
        }

        // Gonna call it once -- prob need to move it out to ng-init
        $scope.doRefresh();
    }]);



