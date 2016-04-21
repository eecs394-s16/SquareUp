angular
    .module('example')
    .controller('SettingsController', ['$scope', 'supersonic', function($scope, supersonic) {
	//$scope.navbarTitle = "Settings";
	var changeBalance = function(splitter,purchase,sign){
	    var change = sign * Number(purchase["price"]) / Number(purchase["splitAmong"]);
	    if (splitter in $scope.balances){
		$scope.balances[splitter] += change;
	    }
	    else {
		$scope.balances[splitter] = change;
	    }
	};
	var addCredits = function(snapshot, prevKey){
	    supersonic.logger.log("addCredits called.");
	    var purchase = snapshot.val();
	    for (var splitter in purchase["people"]){
		changeBalance(splitter,purchase,1);
		supersonic.logger.log($scope.balances[splitter]);
		supersonic.logger.log(splitter);
	    }
	};
	var addDebts = function(purchID){
	    supersonic.logger.log("addDebts called.");
	    supersonic.logger.log(purchID.key());
	    var PurchaseRef = new Firebase('https://squareup-split.firebaseio.com/purchases/'.concat(purchID.key()));

	    PurchaseRef.on("value",function(snapshot){
		supersonic.logger.log("This happens at least once");
		var purchase = snapshot.val();
		changeBalance(purchase["buyer"],purchase,-1);
		supersonic.logger.log($scope.balances[purchase["buyer"]]);
		supersonic.logger.log(purchase["buyer"]);

	    });

	};
	$scope.doRefresh = function(){
	    supersonic.logger.log("Summary refresh called.");
	    $scope.balances = {};
	    $scope.positives = {};
        $scope.userData = JSON.parse(window.localStorage.getItem('userData'));

        var ProfileRef = new Firebase('https://squareup-split.firebaseio.com/profiles/'+$scope.userData.uid);
        var name = "";

        ProfileRef.on("value", function(dataSnapshot){
        	name = dataSnapshot.child("username").val();
        	supersonic.logger.log("name: "+ name);     
        };

	    //TODO: eliminate hardcoding chris3 here
	    var creditRef = new Firebase('https://squareup-split.firebaseio.com/purchases');
	    creditRef.orderByChild("owner").equalTo(name).on("child_added",addCredits);

	    var debtRef = new Firebase('https://squareup-split.firebaseio.com/profiles/'+$scope.userData.uid+'/partyToPurchase');
	    debtRef.on("value",function(purchases){ purchases.forEach(addDebts); } );
	    $scope.$apply();
	};
	$scope.doRefresh();
    }]);
