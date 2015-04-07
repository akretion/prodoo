'use strict';

angular.module('prodapps')
	.controller('DecoupeCtrl', function ($scope, $state, jsonRpc, prodooSync) {

	$scope.sync = { data: null, current: { filter: { 'state':'draft'},  item : {sequence: 99999}}};
	var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

	$scope.print = function (item) {
		console.log('print ! ', item);
	};

	$scope.do = function (item) {
		$scope.print(item);
		$scope.markAsDone(item);
	} 

	$scope.markAsDone = function (item) {
		jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id]).then(function () {
			item.state = 'done';
		}, function () {
		});
	};

	$scope.$on('$destroy', function() {
		destroy();
	});
});
