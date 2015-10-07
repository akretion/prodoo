'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', ['$scope', '$state', 'jsonRpc', 'prodooSync', '$notification', 'prodooPrint', '$timeout', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, $timeout) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    $scope.workcenter = $state.params.workcenter;
    var destroy = prodooSync.syncData({workcenter: $scope.workcenter}, $scope.sync);
    $scope.$on('$destroy', destroy);

    $scope.fields = [];
    $scope.sameLotNumber = [];

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        newVal._v = newVal._v || {};

        fetchPdf(newVal);

        $scope.fields = newVal.components;
        $scope.sameLotNumber = $scope.sync.data.filter(function (i) {
          return i.lot_number === newVal.lot_number && i.id != newVal.id;
        });

        //some values needs to be calculated once, because the user may
        //start to fill the form
        //go to another task (complete it)
        //go back to the first task (and we don't want to loose any data)

        //do it each time because task with sameLotNumber may be completed
        newVal._v.suggestedRacks = ($scope.sameLotNumber.length) ? $scope.sameLotNumber[0].rack : []; //mind the "s"

        //if no suggestedRack, may be there is in components (like in assemlby stuff)
        if (newVal._v.suggestedRacks.length == 0) {

          
          newVal._v.suggestedRacks = createArray(newVal.qty).map(function (useless, idx) { //for (idx in 1..5)
            
            //return [ [a1,b1], [a2,b2], [an,bn]] with n = qty
            return newVal.components.map(function (component) {
              return component.rack[idx];
            });

          }).map(function (a) { //stringify
            if (a[0] != a[1]) //always 2
              return a.join(',');
            return a[0]; //no need to duplicate
          });
        }
        
        if (!newVal._v.lines) {
          //first show of this item. User has not entered anything

          //get rack from the item (prefiled by odoo) 
          newVal._v.racks = newVal.rack; // mind the "s" (or lack of)

          if (!newVal._v.racks.length) //if no rack in the task coming from odoo
            newVal._v.racks = newVal._v.suggestedRacks; //try to add some with another task from the same lotNumber

        } else {
          //it's not the first time we show this item

          //we don't use references in the view
          //therefor we need to check each time if suggestedRacks has changed
          //BUT entered input has priority over suggestedRacks

          //check if there is some info already provided to the view
          if ( newVal._v.lines.some(function(l) { return l.rack && l.rack.length > 0; })) {
            //yes there is, get it all
            newVal._v.racks = newVal._v.lines.map(function (l) { return l.rack; });
          } else {
            //nothing has been entered since first time
            //so there is nothing new comming from odoo
            //only new things may be from suggestedRacks
            newVal._v.racks = newVal._v.suggestedRacks;
          }

        }

        if (!newVal._v.scans) //do it only once (because user may have entered some date)
          newVal._v.scans = createArray(newVal.qty).map(function () {
            //if item.components is [ {name: 'tissu'}, { name:'profile'}]
            // and item.qty = 2
            // then scans whould be [ [null, null], [null, null]]

            return createArray(newVal.components.length);
          });
      
        if (!newVal._v.locks) //do it only once (because some lines may be terminated )
          newVal._v.locks = createArray(newVal.qty).map(function () { return false; });
        
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

          //for locking the line when it's filled and valid
          l.lock = newVal._v.locks[idx];
          return l;
        });

    });

    

    $scope.checkLocks = function () {
    //check if there is some lines still locked
    //usefull because the "ok" buttn should be disabled otherwise
      if (!$scope.sync.current.item)
        return false;

      return $scope.sync.current.item._v.lines.filter(function (l ){ return l.lock==false; }).length !== 0;
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

    $scope.focusOnLineRack = function (line) {
      //when rack input is focused, 
      line.rack = ''; //erase content
      line.lock = false; //unlock the line
    };
    $scope.focusOnLineScan = function(line, idx) {
      //when scan input is focused
      line.scans[idx] = '';//erase content
      line.lock = false; //unlock the line
    };

    $scope.isLineValid = function(grid, idx) {
      return grid[idx].$valid;
    };

    $scope.do = function(item) {
      $notification('Pending');
      item._v.lock = true;

      //get back rack in item
      item.rack = item._v.lines.map(function (r) {
        return r.rack; 
      });

      jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, item.rack ]).then(function () {
        item.state = 'done';
        $notification('Done');
        $scope.$broadcast('syncAfterDone', item);
      }, function () {
        $notification('an error has occured');
      }).then(function () {

        $timeout(function () {
            item._v.lock = false;
        }, 1000);
      });
    };

    $scope.print = function (item, qte) {
        $notification('Printing...');
        prodooPrint(item, qte);
    };

    $scope.take = function(item) {
      item._v.lock = true;
      jsonRpc.call('mrp.production.workcenter.line', 'book', [[item.id], $scope.workcenter]).then(function (hasSucceed) {
        console.log('voici le result', hasSucceed);
        if (hasSucceed) {
          item.workcenter_id = $scope.workcenter;
          $notification('Booked');
        } else {
          item.workcenter_id = false;
          $notification('Already booked');
        }
      }).then(function () {

        $timeout(function () {
          item._v.lock = false;
        }, 1000);
      });
    };

    function fetchPdf(item) {
      //load a pdf async
      return item.label || jsonRpc.call('mrp.production.workcenter.line', 'get_pdf', [item.id]).then(function (d) {
        item.label = d;
      });
    }

    function createArray(length) {
    //create and fill with null an array of length
    // (Array.prototype.fill() is not ready yet / polyfill instead :
      var a = [], l = 0;
      for (l = 0; l < length; l++) {
        a.push(null);
      }
      return a;
    }

}]);
