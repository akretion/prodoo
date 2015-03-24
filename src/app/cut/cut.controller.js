'use strict';

angular.module('prodapps')
  .controller('CutCtrl', function ($scope, $state, jsonRpc, $cookies) {
  console.log('Cut ctrl');

  	$scope.list = [];
	$scope.list = [{'status': 'toDo', 'id': 'a', 'title': 'Couper un tronc', 'long': '<p>Prendre un bon gros tronc de bucheron</p><p><img src="http://www.mercialfred.com/media-data/864/photo_article_864.jpg"></p>'},
				   {'status': 'toDo', 'id': 'b', 'title': 'Enlever les feuilles', 'long': 'On va pas attendre l\'autommne !<br><img src="http://www.nantes-shiatsu.fr/blog/wp-content/uploads/2008/09/automne.jpg">'}];
	$scope.current = { filter: { 'status':'toDo'},  item : $scope.list[0]};
  	$scope.fetchList = function () {
  		console.log('fetchList');
  		
  		jsonRpc.syncDataImport('mrp.production.workcenter.line', 'prodoo', [],50).then(function () {
  			console.log('mrpSucceed');
  		},function (a) {
  			console.log('Une erreur est survenue', a);
  		});
  	};
  	$scope.fetchList();

  	$scope.print = function (item) {
  		console.log('print ! ', item);
  	};

  	$scope.do = function (item) {
  		item.status = 'done';
  	}
  });
