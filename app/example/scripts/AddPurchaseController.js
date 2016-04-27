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

  $scope.people = [];
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
          // TODO: Sanity check for input fields to make sure every field is filled in.
          $scope.userData = JSON.parse(window.localStorage.getItem('userData'));
          var ProfileRef = new Firebase('https://squareup-split.firebaseio.com/profiles/'+$scope.userData.uid);
          ProfileRef.once("value", addPurchase);
	    }
	}

	var addPurchase = function(usernameSnapshot) {
	    var ppl = {};
      $scope.people.forEach(function(person){
          ppl[person.personName] = true;
      });
	    var purchase = {
                createdAt: Date.now(),
                owner: usernameSnapshot.child("username").val(),
                itemName: $scope.data.itemName,
                price: $scope.data.price,
                splitAmong: $scope.data.numPeople,
                numPaid: 0,
                numNotPaid: $scope.data.numPeople,
                people: ppl
                // TODO: need a way to see how many people purchased this by counting the number of item-select class div
      };

	    var PurchasesRef = new Firebase('https://squareup-split.firebaseio.com/purchases');
	    var newPurchaseRef = PurchasesRef.push(purchase);

	    $scope.purchaseKey = newPurchaseRef.key();
	    supersonic.logger.log($scope.purchaseKey);
	    var personRef = new Firebase('https://squareup-split.firebaseio.com/profiles');
	    $scope.purchasesAdded = 0;

	    $scope.people.forEach(function(person){
		      supersonic.logger.log("Updating purchase index for: " + person.personName);
		      personRef.orderByChild('username').equalTo(person.personName).once('child_added',addPurchaseToIndex);
	    });

	};

	var addPurchaseToIndex = function(dataSnapshot){
	    var profilePath = dataSnapshot.ref().toString();
	    var profileRef = new Firebase(profilePath+"/purchasesOwed/"+$scope.purchaseKey);
	    profileRef.set('true');
	    supersonic.logger.log("added purchase to index for user" + profilePath);
	    $scope.purchasesAdded++;

	    if ($scope.purchasesAdded === $scope.people.length){
		      leavePage();
	    }
	};

	var leavePage = function(){
	    var options = {
		      message: "Your friends received your bill!",
		      buttonLabel: "Ok"
	    };

	    supersonic.ui.dialog.alert("Squared it up!", options).then(function() {
		      supersonic.logger.log("Alert closed.");
	    });
	    supersonic.ui.layers.pop();
	};

	$scope.addPerson = function() {
	    $scope.people.push({personName:""});
	    $scope.people.foreach(function(person){
		      supersonic.logger.log(person.personName);
	    });

	    supersonic.logger.log($scope.people.length);

	    $scope.$apply();
	    /*
             var myEl = angular.element( document.querySelector( '.list-people' ) );
             myEl.append('<label class="item item-input"><span class="input-label">Share With:</span><input type="text" placeholder="Who are you sharing it with?"></label>');
             */
  };

  $scope.removePerson = function(){
       $scope.people.pop();
       supersonic.logger.log("The number of people is :" + $scope.people.length);
               //$scope.$apply();
  };

    }]);
