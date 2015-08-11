'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, $timeout, $ionicScrollDelegate, filterFilter, orderByFilter) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
    $scope.fields = [];
    $scope.sameLotNumber = [];
    $scope.filteredList = [];

    $scope.$watch('sync.data', function (newVal) {
      $scope.filteredList = orderByFilter(filterFilter(newVal, $scope.sync.current.filter),'sequence');
    });

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
        newVal._v.suggestedRacks = ($scope.sameLotNumber.length) ? $scope.sameLotNumber[0].rack : []; //mind the "s"

        //if no suggestedRack, may be there is in components (like in assemlby stuff)
        if (newVal._v.suggestedRacks.length == 0)
          newVal._v.suggestedRacks = newVal.components.map(function (c) { 
            return c.rack; //extract rack
          }).filter(function(value, index, array) {  //uniq
              return array.indexOf(value) === index; 
          });

        
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



        function createArray(length) {
        //create and fill with null an array of length
        // (Array.prototype.fill() is not ready yet / polyfill instead :
          var a = [], l = 0;
          for (l = 0; l < length; l++) {
            a.push(null);
          }
          return a;
        }

    });

    

    $scope.checkLocks = function () {
    //check if there is some lines still locked
    //usefull because the "ok" buttn should be disabled otherwise
      if (!$scope.sync.current.item)
        return false;

      return $scope.sync.current.item._v.lines.filter(function (l ){ return l.lock==false; }).length !== 0;
    };

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
