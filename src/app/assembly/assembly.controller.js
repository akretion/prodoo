'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, $timeout, $ionicScrollDelegate) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
    $scope.fields = [];
    $scope.sameLotNumber = [];

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        newVal._v = newVal._v || {};

        $scope.fields = newVal.components;
        $scope.sameLotNumber = $scope.sync.data.filter(function (i) {
          return i.lot_number === newVal.lot_number && i.id != newVal.id;
        });

        //some values needs to be calculated once, because the user may
        //start to fill the form
        //go to another task (complete it)
        //go back to the first task (and we don't want to loose any data)

        //do it each time because task with sameLotNumber may be completed
        newVal._v.suggestedRacks = unserializeRacks( ($scope.sameLotNumber[0]) ? ($scope.sameLotNumber[0].rack[0]) : null);

        if (!newVal._v.racks) //do it only once (because user may have entered some data)
          newVal._v.racks = unserializeRacks(newVal.rack[0]);
        
        if (!newVal._v.scans) //do it only once (because user may have entered some date)
          newVal._v.scans = createArray(newVal.qty).map(function () {
            //if item.components is [ {name: 'tissu'}, { name:'profile'}]
            // and item.qty = 2
            // then scans whould be [ [null, null], [null, null]]

            return createArray(newVal.components.length);
          });
      
        if (!newVal._v.locks) //do it only once (because some lines may be terminated )
          newVal._v.locks = createArray(newVal.qty);

        //do it each time
        newVal._v.lines = createArray(newVal.qty).map(function (unused, idx) {
          var l = {};
          //for storing the scans - only usefull for the operator for keeping track of progression
          //and ensuring she selected the good input product
          l.scans = newVal._v.scans[idx];

          //for storing the output rack of the operation 
          //it may be already filled  
          //stored in odoo
          l.rack = newVal._v.racks[idx];

          //it's may be already filled
          l.suggestedRack = newVal._v.suggestedRacks[idx];
          
          //for locking the line when it's filled and valid
          l.lock = newVal._v.locks[idx];
          return l;
        });



        function createArray(length) {
        //create and fill with null an array of length
        // (Array.prototype.fill() is not ready yet / polyfill instead :
          var a = [], l = 0;
          for (l = 0; l < length; l++) {
            a.push(null);
          }
          return a;
        }

        function unserializeRacks(racks) {
          //currently item.rack is a kind of : ";;a;b" instead of ['a','b']

          if (!racks)
            return [];
          console.log('racks',racks);
          return racks.split(';').filter(function (i) { return i.length; }); //trim shit with filter
        }


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
