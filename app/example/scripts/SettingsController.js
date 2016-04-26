angular
.module('example')
.controller('SettingsController', ['$scope', 'supersonic', function($scope, supersonic) {
	//$scope.navbarTitle = "Settings";

	var changeBalance = function(splitter,purchase,sign){
		var change = sign * Number(purchase["price"]) / Number(purchase["splitAmong"]);
		supersonic.logger.log("The change is :" + change);
		if (splitter in $scope.balances){
			$scope.balances[splitter] += change;
		}
		else {
			$scope.balances[splitter] = change;
		}
		supersonic.logger.log("The length is :" + $scope.balances.length);

		//$scope.$apply();
	};
	var addCredits = function(snapshot, prevKey){
		supersonic.logger.log("addCredits called.");
		var purchase = snapshot.val();
		for (var splitter in purchase["people"]){
			changeBalance(splitter,purchase,1);
			//supersonic.logger.log($scope.balances[splitter]);
			//supersonic.logger.log(splitter);
		}
	};
	var addDebts = function(purchID){
		supersonic.logger.log("addDebts called.");
		supersonic.logger.log(purchID.key());
		var PurchaseRef = new Firebase('https://squareup-split.firebaseio.com/purchases/'.concat(purchID.key()));

		PurchaseRef.on("value",function(snapshot){
			supersonic.logger.log("This happens at least once");
			var purchase = snapshot.val();
			changeBalance(purchase["owner"],purchase,-1);
			supersonic.logger.log($scope.balances[purchase["owner"]]);
			supersonic.logger.log(purchase["owner"]);

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
			supersonic.logger.log("name queried: "+ name);

			var creditRef = new Firebase('https://squareup-split.firebaseio.com/purchases');
			creditRef.orderByChild("owner").equalTo(name).on("child_added",addCredits);

			var debtRef = new Firebase('https://squareup-split.firebaseio.com/profiles/'+$scope.userData.uid+'/purchasesOwed');
			supersonic.logger.log("The USER ID IS:"+$scope.userData.uid);
			debtRef.on("value",function(purchases){ purchases.forEach(addDebts); } );
			$scope.$apply();
		});
	};

	supersonic.logger.log("before doRefresh()");
	//$scope.doRefresh();
	supersonic.logger.log("after doRefresh()");

}]);
