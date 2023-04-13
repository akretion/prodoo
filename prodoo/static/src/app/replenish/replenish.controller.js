'use strict';

angular.module('prodapps')
.controller('ReplenishCtrl', ['$scope', '$state', 'jsonRpc', '$notification', 'apps', function ($scope, $state, jsonRpc, $notification, apps) {
    var workcenters = apps.workcenters;
    $scope.workcenter = $state.params.workcenter;
    console.log('workcenter: ', $scope.workcenter, apps);
    $scope.title = guessTitle($scope.workcenter);
    
    $scope.replenishLine = { qty: '0', barcode: undefined };

    // trigger focus on first input in order to let the
    // user enter a new entry.
    // no need to wait for the return of submit()
    angular.element("#product")[0].focus()

    $scope.save = function() {
      $scope.error = 'Wait...';

      jsonRpc.call('stock.replenish', 'add_line', [$scope.workcenter, $scope.replenishLine.barcode, $scope.replenishLine.qty]).then(function () {
        //do the changes
        $scope.error = 'DONE';
        $scope.replenishLine.qty = 0;
        $scope.replenishLine.barcode = undefined;
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
