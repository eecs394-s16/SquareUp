angular
    .module('example')
/*
    .factory('Purchases', ['$firebaseArray', function($firebaseArray) {
        return $firebaseArray(new Firebase('https://squareup-split.firebaseio.com/purchases'));
    }])*/

    .controller('AddPurchaseController', ['$scope', 'supersonic', function($scope, supersonic) {
        $scope.navbarTitle = "Add a Purchase";
        $scope.squareUp = function() {
            supersonic.logger.log("clicked squareUp.");

            var PurchasesRef = new Firebase('https://squareup-split.firebaseio.com/purchases');
            var purchase = {
                ownerID: $scope.data.ownerID,
                itemName: $scope.data.itemName,
                price: $scope.data.price,
            };
            supersonic.logger.log("about to push.");
            supersonic.logger.log(purchase);


            var newPurchaseRef = PurchasesRef.push().set(purchase);
            supersonic.logger.log(newPurchaseRef);
            supersonic.logger.log("done pushing.");




            var options = {
              message: "Your friends received your bill!",
              buttonLabel: "Ok"
            };

            supersonic.ui.dialog.alert("Squared it up!", options).then(function() {
              supersonic.logger.log("Alert closed.");
            });
        }

        $scope.addPerson = function() {
            var myEl = angular.element( document.querySelector( '.list-people' ) );
            myEl.append('<label class="item item-input"><span class="input-label">Share With:</span><input type="text" placeholder="Who are you sharing it with?"></label>');
        }
    }]);
