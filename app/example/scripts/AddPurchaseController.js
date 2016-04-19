angular
.module('example')
.controller('AddPurchaseController', ['$scope', 'supersonic', function($scope, supersonic) {
    $scope.navbarTitle = "Add a Purchase";
    var isFloat = function(n) {
        return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
    };
    var validateXSS = function(str){
        // some basic xss tags to prevent
        // will add more later
        var xssCodes = ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&#x2f;', '<script>', '\'', '\"'];

        for (var i = 0; i < xssCodes.length; i++) {
            if (str.indexOf(xssCodes[i]) !== -1) {
                return false;
            }
        }
        return true;
    };
    var validate = function(input,type){
        switch(type){
            case String:
                return validateXSS(input);
            case Number:
                return isFloat(input);
        }
    };

    $scope.validateInput = function() {
        if (!validate($scope.data.itemName,String)){
            return false;
        } else if (!validate($scope.data.price,Number)){
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
		    supersonic.ui.layers.pop();
        }
    }

    $scope.addPerson = function() {
        var myEl = angular.element( document.querySelector( '.list-people' ) );
        myEl.append('<label class="item item-input"><span class="input-label">Share With:</span><input type="text" placeholder="Who are you sharing it with?"></label>');
    }
}]);


