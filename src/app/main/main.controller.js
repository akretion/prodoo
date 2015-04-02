'use strict';

angular.module('prodapps')
  .controller('MainCtrl', function ($scope, $state) {
	
	$scope.workcenters = [
		{ app: 'main.cut', workcenter: 1 },
		{ app: 'main.cut', workcenter: 2 },
		{ app: 'main.decoupe', workcenter: 1 },
		{ app: 'main.assembly', workcenter: 1 },
		{ app: 'main.venetianAssembly', workcenter: 33 },
		{ app: 'main.carrierAssembly', workcenter: 32 },

	];
	$scope.$state = $state;
});
