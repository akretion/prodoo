'use strict';

angular.module('prodapps').directive('douchette', [ function () {
return {
	scope: { 'values':'=douchette'}, //values : array expected 
	template:'<form ng-submit="add()">'+
	'<table class="table table-striped">'+
		'<tr ng-repeat="val in values" ng-show="val.length"><td>{{ val }}</td><td><a class="btn btn-danger" role="button" ng-click="rm(val)">x</a></td></tr>'+
		'<tr><td><input autofocus="true" ng-model="value"></input></td><td><button class="btn">+</button></td></tr>' +
	'</table>'+
	'</form>',
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
