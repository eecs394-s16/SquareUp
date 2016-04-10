angular
    .module('example')
    .controller('AddPurchaseController', ['$scope', 'supersonic', function($scope, supersonic) {
        $scope.navbarTitle = "Add a Purchase";

        $scope.validateInput = function() {
            if (!(new Sanitize($scope.data.itemName, String).validate())) {
                return false;
            } else if (!(new Sanitize($scope.data.price, Number).validate())) {
                return false;
            } // TODO: add sanitization on people name once that's there
            else {
                return true;
            }
        };

        $scope.squareUp = function() {
            if (!$scope.validateInput()) {
                var options = {
                    message: "One (or more) of your input is invalid!",
                    buttonLabel: "Ok",
                };
                supersonic.ui.dialog.alert("ERROR", options).then(function() {
                    supersonic.logger.log("Alert closed.");
                });
                return;
            } else {
                supersonic.logger.log("Valid Input.");
                var PurchasesRef = new Firebase('https://squareup-split.firebaseio.com/purchases');

                // TODO: Sanity check for input fields to make sure every field is filled in.
                var purchase = {
                    createdAt: Date.now(),
                    ownerID: $scope.data.ownerID,
                    itemName: $scope.data.itemName,
                    price: $scope.data.price,
                    splitAmong: $scope.data.numPeople,
                    numPaid: 0,
                    numNotPaid: $scope.data.numPeople, 
                    // TODO: need a way to see how many people purchased this by counting the number of item-select class div
                };

                var newPurchaseRef = PurchasesRef.push(purchase);

                /// Needs to be bound as a callback to push().set
                var options = {
                    message: "Your friends received your bill!",
                    buttonLabel: "Ok"
                };

                supersonic.ui.dialog.alert("Squared it up!", options).then(function() {
                    supersonic.logger.log("Alert closed.");
                });
            }
        }

        $scope.addPerson = function() {
            var myEl = angular.element( document.querySelector( '.list-people' ) );
            myEl.append('<label class="item item-input"><span class="input-label">Share With:</span><input type="text" placeholder="Who are you sharing it with?"></label>');
        }
    }]);


