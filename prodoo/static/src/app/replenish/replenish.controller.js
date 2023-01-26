'use strict';

angular.module('prodapps')
.controller('ReplenishCtrl', ['$scope', '$state', 'jsonRpc', '$notification', 'apps', function ($scope, $state, jsonRpc, $notification, apps) {
    var workcenters = apps.workcenters;
    $scope.workcenter = $state.params.workcenter;
    console.log('workcenter: ', $scope.workcenter, apps);
    $scope.title = guessTitle($scope.workcenter);
    
    $scope.replenishLine = { qty: '0', barcode: undefined };

    $scope.save = function() {
      $scope.error = 'Wait...';

      jsonRpc.call('stock.replenish', 'add_line', [$scope.workcenter, $scope.replenishLine.barcode, $scope.replenishLine.qty]).then(function () {
        //do the changes
        $scope.error = 'DONE';
      }, function (err) {
        console.log(err)
        $scope.error = 'an error has occured';
      })
    };

    function guessTitle(workcenter_id) {
      return workcenter_id && workcenters.filter(function (w) {
          return w.id === workcenter_id;
      }).pop().name;
    }
}]);