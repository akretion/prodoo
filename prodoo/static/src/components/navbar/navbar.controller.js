'use strict';

angular.module('prodapps')
  .controller('NavbarCtrl', ['$scope', '$state', '$stateParams', 'apps', function ($scope, $state, $stateParams, apps) {
    var workcenters;

    $scope.workcenter_id = 0;

    apps.then(function (x) {
    	workcenters = x.workcenters;
    	//try if loading directly
		  $scope.title = guessTitle($stateParams.workcenter)
    });

    $scope.$on('$stateChangeSuccess', function () {
      
      if ($stateParams.workcenter == undefined || $stateParams.workcenter == null){
        $scope.workcenter_id = 0;
      } else {
        $scope.workcenter_id = $stateParams.workcenter;
      }

      //try if comming from another page
      if ($scope.workcenter_id > 0) {
        $scope.title = guessTitle($stateParams.workcenter)
      } else {
        $scope.title = '';
      }    

    });

    function guessTitle(workcenter_id) {
    	return workcenter_id && workcenters.filter(function (w) {
	    		return w.id === workcenter_id;
	    }).pop().name;
    }
  }]);
