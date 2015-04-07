'use strict';

angular.module('prodapps')
  .controller('DecoupeCtrl', function ($scope, $state, jsonRpc) {

	$scope.workcenter = ;
	$scope.modale = { casier : '' };
	$scope.current = { filter: { 'state':'draft'},  item : {sequence: 99999}}; 
  
  destroy = prodooSync({domain: $state.params.workcenter}, $scope.data, $scope.current);

  $scope.$on('$destroy', destroy);


  
  $scope.print = function (item) {
  		console.log('print ! ', item);
  };

  	$scope.do = function (item, modale) {
		console.log('modale ', modale);
        	jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, modale.casier]).then(function () {
		}, function () {
		});
		modale.casier = "";
  	};
  });
