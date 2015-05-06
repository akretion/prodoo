'use strict';

angular.module('prodapps')
	.controller('StripCutCtrl', function ($scope, $state, jsonRpc, prodooSync, prodooPrint, $notification) {

	$scope.casier = [];
	$scope.sync = { data: null, current: { filter: { 'state':'draft'}}};
	var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

	$scope.print = function (item) {
		console.log('print ! ', item);
		prodooPrint(item);
		$notification('Printing...');
	};

	$scope.do = function (item, modale) {
		$notification('Done');
		$scope.markAsDone(item, modale);
	}

	$scope.markAsDone = function (item) {
		jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, $scope.casier.join(';')]).then(function () {
			item.state = 'done';
			$notification('Done');
		}, function () {
			$notification('an error has occured');
		});
	};

	$scope.$on('$destroy', function() {
		destroy();
	});
});
