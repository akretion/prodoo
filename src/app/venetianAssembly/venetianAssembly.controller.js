'use strict';

angular.module('prodapps')
    .controller('VenetianAssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, prodooPrint, $notification) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);

    $scope.print = function (item) {
        console.log('print ! ', item);
        $notification('Printing...');
        prodooPrint(item);
    };

    $scope.do = function (item, modale) {
        $scope.print(item);
        $scope.markAsDone(item, modale);
    }

    $scope.markAsDone = function (item, modale) {

        jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id]).then(function () {
            item.state = 'done';
            $notification('Done');
            $scope.updateSalesDone();
        }, function () {
            $notification('an error has occured');
        });
    };

    $scope.$watch('sync.data', function (newVal) {
        if (newVal)
            $scope.updateSalesDone();
    });

    $scope.updateSalesDone = function () {
        $scope.salesDone = [];

        var draft = $scope.sync.data.filter(function(e) {
            return e.state !== 'done';
        }).map(function (e) {
            return e.sale_name;
        });

        $scope.salesDone = $scope.sync.data.filter(function (e) {
            return draft.indexOf(e.sale_name) === -1 && $scope.sync.current.item.sale_name != e.sale_name;
        });
        console.log(draft, $scope.salesDone);
    };


    $scope.$on('$destroy', function() {
        destroy();
    });
});
