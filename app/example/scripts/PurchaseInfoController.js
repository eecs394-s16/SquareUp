angular
    .module('example')
    .controller('PurchaseInfoController', ['$scope', 'supersonic', function($scope, supersonic) {

supersonic.ui.views.current.whenVisible( function(){
  var get_key = steroids.view.params.key;
  supersonic.logger.log("key= "+ get_key);
});

}]);

