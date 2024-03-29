'use strict';

angular.module('prodapps')
  .controller('NavbarCtrl', ['$scope', '$state', '$stateParams', 'apps', 'jsonRpc', function ($scope, $state, $stateParams, apps, jsonRpc) {
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

    $scope.logout = function() {
      // really dirty
      // logout should be called from route.go(logout)
      // do not know why, but we have to do a full reload
      // of the page in order to show the login form
      jsonRpc.logout(true).then(function () {}, function() {}).then(
        function() {
          window.location.reload()
        }
      );
    }
  }]);
