'use strict';

angular.module('prodapps')
  .controller('CutCtrl', function ($scope, $state, jsonRpc, $cookies) {
  console.log('Cut ctrl');

	$scope.workcenter = $state.params.workcenter;
  $scope.list = [];
	$scope.current = { filter: { 'state':'draft'},  item : {sequence: 99999}}; 
  	$scope.fetchList = function () {
  		console.log('fetchList');
  		
        $scope.list = jsonRpc.syncImportObject({
            model: 'mrp.production.workcenter.line',
            func_key: 'prodoo',
            domain: [['workcenter_id', '=', $scope.workcenter ]],
            limit: 50,
            interval: 2000
        });
	$scope.$watch('list.timekey', function (newVal, oldVal) {
		console.log('watched !', oldVal, newVal);
		$scope.data = [];
		var item;
		for(var key in $scope.list.data) {
			item = $scope.list.data[key];
			if (item.sequence < $scope.current.item.sequence && item.state != 'done')
				$scope.current.item = item;

			$scope.data.push(item);
		}
	});
	
    console.log($scope.list);
    }      
  	$scope.fetchList();


  	$scope.print = function (item) {
  		console.log('print ! ', item);
  	};

  	$scope.do = function (item) {
  		item.state= 'done';
  	};
  });
