'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, $timeout, $ionicScrollDelegate) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
    $scope.fields = [];

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        newVal._v = newVal._v || {};

        $scope.fields = newVal.components;
        
        newVal._v.casiers = []; //item.rack is a semicol separated list; we want it as an array (.length = qty)
        if (newVal.rack[0])
          newVal._v.casiers = newVal.rack[0].split(';') //[]; //rack shoud be a better fit !

        if (!newVal._v.scans) {
        //for storing the scans - only usefull for the operator for keeping track of progression
        //and ensuring she selected the good input product
        //scan is not stored in odoo

          newVal._v.scans = [];
          newVal._v.locks = [];
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
            newVal._v.scans.push(line);
            newVal._v.locks.push(true); //for locking the lines
          }
        }

        //if there is another task with same lot_number
        //and the other one is done
        //and they have the same qty
        //then we can prefill "suggestedRack"  
        newVal._v.suggestedRack = [];

        $scope.sameLotNumber = $scope.sync.data.filter(function (i) {
          return i.lot_number === newVal.lot_number && i.id != newVal.id;
        });

        $scope.sameLotNumber.forEach(function (item) { //normalement on devrait en avoir qu'un
          //should be : 
          // newVal.suggestedRack = item.rack;
          //but currently item.rack is a kind of : ";;a;b" instead of ['a','b']
          if (item.rack[0])
            newVal._v.suggestedRack = item.rack[0] //because it's a [string]
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

    $scope.book = function(item) {
      //assign the task to the current workcenter
      item._v.lock = true;
      jsonRpc.call('mrp.production.workcenter.line', 'prodoo_book', [item.id]).then(function () {
        //do the changes
        $notification('Done');
      }, function () {
        $notification('an error has occured');
      }).then(function () {
        item._v.lock = false;
      });
    };

    $scope.do = function(item) {
      $notification('Pending');
      item._v.lock = true;

      if (item._v.casiers && item._v.casiers.length > 0 )
        item.rack = item._v.casiers.join(';');

      jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, item.rack ]).then(function () {
        item.state = 'done';
        $notification('Done');
      }, function () {
        $notification('an error has occured');
      }).then(function () {
        item._v.lock = false;
      });
    };

    $scope.print = function (item, qte) {
        $notification('Printing...');
        prodooPrint(item, qte);
    };

    $scope.$on('$destroy', destroy);

});
