angular
    .module('example')
    .controller('PurchasesViewController', ['$scope', 'supersonic', function($scope, supersonic) {
        // Refreshes the page and grabs new purchase data from firebase
        $scope.purchases = [];//empty array 
        $scope.doRefresh = function() {

            supersonic.logger.log("Refresh Called.");
            var PurchasesRef = new Firebase('https://squareup-split.firebaseio.com/purchases');
            //event type as child_added instead of value because ng-orderBy only processes array
            PurchasesRef.orderByChild("price").on("child_added", function(snapshot) {
                 var purchase = snapshot.val();
                $scope.purchases.push(purchase); //refresh would retrieve all the data
            });
        }

        // Gonna call it once -- prob need to move it out to ng-init
        //$scope.doRefresh();
    }]);



