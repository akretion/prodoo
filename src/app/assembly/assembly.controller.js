'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
    $scope.fields = [];
    $scope.scans = [];
    $scope.casier = [];
    $scope.locks = [];

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        $scope.fields = newVal.components;

        if (!newVal.casiers)
          newVal.casiers = [];

        if (!newVal.scans) {
          newVal.scans = [];
          //if item.components is [ {name: 'tissu'}, { name:'profile'}]
          // and item.qty = 2
          // then scans whould be [ [null, null], [null, null]]
          // (Array.prototype.fill() is not ready yet / polyfill instead :

          var line = [], k = 0, l = 0;
          for (k = 0; k < newVal.qty; k++) {
            line = [];
            for (l = 0; l < newVal.components.length; l++) {
              line.push(null);
            }
            newVal.scans.push(line);
            $scope.locks.push(true);
          }
        }

    });

    $scope.do = function(item) {
        $scope.markAsDone(item);
    };

    $scope.markAsDone = function (item) {
        jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, $scope.casier.join(';')]).then(function () {
            item.state = 'done';
            $notification('Done');
        }, function () {
            $notification('an error has occured');
        });
    };

    $scope.$on('$destroy', destroy);

});
