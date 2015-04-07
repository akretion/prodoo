'use strict';

angular.module('prodapps')
  .controller('DecoupeCtrl', function ($scope, $state, jsonRpc, prodooSync) {
	$scope.modale = { casier : '' };
	$scope.current = { filter: { 'state':'draft'},  item : {sequence: 99999}}; 
 	console.log('prodooSync', prodooSync); 
	$scope.sync = { data: null , current: $scope.current};
  var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

  $scope.$on('$destroy', function() {
	console.log('destroy', destroy);
	destroy();
});

$scope.$watch('sync.data', function () {
	console.log('data changed', $scope.sync);
});
  
  $scope.print = function (item) {
  		console.log('print ! ', item);
  };

  	$scope.do = function (item ) {
        	jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id]).then(function () {
			item.state = 'done';
		}, function () {
		});
  	};
  });
