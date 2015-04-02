'use strict';

angular.module('prodapps')
  .controller('VenetianAssemblyCtrl', function ($scope, $state, jsonRpc, prodooConfig) {
  console.log('Cut ctrl');
	$scope.workcenter = $state.params.workcenter;
	$scope.modale = { casier : '' };
  $scope.list = [];
	$scope.current = { filter: { 'state':'draft'},  item : {sequence: 99999}}; 
  	$scope.fetchList = function () {
  		console.log('fetchList');
  		
        $scope.list = jsonRpc.syncImportObject({
            model: 'mrp.production.workcenter.line',
            func_key: 'prodoo',
            domain: [['workcenter_id', '=', $scope.workcenter ]],
            limit: 50,
            interval: prodooConfig.refreshInterval
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
		$scope.updateSalesDone();
	});
	
    console.log($scope.list);
    }      
  	$scope.fetchList();

	$scope.updateSalesDone = function () {
		$scope.salesDone = [];

		var draft = $scope.data.filter(function(e) {
			return e.state === 'draft';
		}).map(function (e) {
			return e.sale_name;
		});

		$scope.salesDone = $scope.data.filter(function (e) {
			return draft.indexOf(e.sale_name) === -1;
		});
	};

  	$scope.print = function (item) {
  		console.log('print ! ', item);

  	};

  	$scope.do = function (item, modale) {
        	jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id]).then(function () {
			item.state = 'done';
			$scope.updateSalesDone();
		}, function () {
		});
  	};
  });
