'use strict';

angular.module('prodapps')
  .controller('CutCtrl', function ($scope,$state, jsonRpc, $cookies) {
  console.log('Cut ctrl');

  	$scope.list = [];
		  	$scope.list = [{'id': 'a'}, {'id': 'b'}];

  	$scope.fetchList = function () {
  		console.log('fetchList');
  		
  		jsonRpc.syncDataImport('mrp.production.workcenter.line', 'prodoo', [],50).then(function () {
		  	//$scope.list = [{'id': 'a'}, {'id': 'b'}];
  		},function (a) {
  			console.log('Une erreur est survenue', a);
  		});
  	};
  	$scope.fetchList();
  });
