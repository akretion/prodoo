'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, $timeout, $ionicScrollDelegate) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
    $scope.fields = [];
    $scope.scans = [];
    $scope.locks = [];

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        $scope.fields = newVal.components;

        if (!newVal.casiers)
          if (newVal.rack[0])
          newVal.casiers = newVal.rack[0].split(';') //[]; //rack shoud be a better fit !
          else
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

        //if there is another task with same lot_number
        //and the other one is done
        //and they have the same qty
        //then we can prefill "suggestedRack"  
        newVal.suggestedRack = [];

        $scope.sync.data.filter(function (i) {
          return i.lot_number === newVal.lot_number && i.id != newVal.id;
        }).forEach(function (item) { //normalement on devrait en avoir qu'un
          //should be : 
          // newVal.suggestedRack = item.rack;
          //but currently item.rack is a kind of : ";;a;b" instead of ['a','b']
          if (item.rack[0])
            newVal.suggestedRack = item.rack[0] //because it's a [string]
            .split(';') //';' is the current separator
            .filter(function (i) { return i.length; }); //trim shit
        });
    });

    $scope.clickTask = function (item) {
      //set to current
      $scope.sync.current.item = item;

      //erase the search
      delete ($scope.sync.current.filter.lot_number);
    
      //scroll to item
      $timeout(function () {
        var offset =  angular.element('#item'+item.id)[0].offsetTop; //can be put in directive
        $ionicScrollDelegate.$getByHandle('leftScroll').scrollTo(0, offset, true);
        //anchorScroll doesn't work well
      },50); //wait dom update
    };

    $scope.setFilter = function (status) {
      if (status === 'toDo')
        $scope.sync.current.filter={state:'!done'};
      if (status === 'done')
        $scope.sync.current.filter={state:'done'};
      if (status === 'eraseSearch')
        delete ($scope.sync.current.filter.lot_number);

      $ionicScrollDelegate.$getByHandle('leftScroll').scrollTop();
      $ionicScrollDelegate.$getByHandle('rightScroll').scrollTop();
    };

    $scope.do = function(item) {
      $notification('Pending');
      item.lock = true;

      if (item.casiers && item.casiers.length > 0 )
        item.rack = item.casiers.join(';');

      jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, item.rack ]).then(function () {
        item.state = 'done';
        $notification('Done');
      }, function () {
        $notification('an error has occured');
      }).then(function () {
        item.lock = false;
      });
    };

    $scope.print = function (item, qte) {
        $notification('Printing...');
        prodooPrint(item, qte);
    };

    $scope.$on('$destroy', destroy);

});
