'use strict';

angular.module('prodapps')
    .controller('TrolleyAssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

    $scope.print = function (item) {
        console.log('print ! ', item);
        $notification('Printing...');
    };

    $scope.do = function (item, modale) {
        $scope.print(item);
        $scope.markAsDone(item, modale);
    }

    $scope.markAsDone = function (item, modale) {
        var casier = null;
        if (modale && modale.casier)
            casier = modale.casier;

            jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, casier]).then(function () {
            if (casier)
                modale.casier = "";
            item.state = 'done';
            $notification('Done');
        }, function () {
            $notification('an error has occured');
        });
    };

    $scope.$on('$destroy', function() {
        destroy();
    });
});
