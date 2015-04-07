'use strict';

angular.module('prodapps').directive('douchette', [ function () {
return {
	scope: { 'values':'=douchette'}, //values : array expected 
	template:'<form ng-submit="add()">'+
	'<ul class="list-unstyled">'+
		'<li ng-repeat="val in values" ng-show="val.length">{{ val }} <a ng-click="rm(val)">x</a></li>'+
	'</ul>'+
	'<input ng-model="value"></input></form>',
	link: function ($scope, elem, attrs) {
		$scope.value = '';
		$scope.rm = function(val) {
			var idx = $scope.values.indexOf(val);
			$scope.values.splice(idx, 1);
		};
		$scope.add = function () {
			if ($scope.value.length > 0)
				$scope.values.push($scope.value);
			$scope.value = ''; 
		};
		elem.find('input').on('focusout', function () {
			$scope.add();
			$scope.$apply(); //mandatory
		});
	}
};
}]);
