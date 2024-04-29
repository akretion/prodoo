'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', ['$scope', '$state', 'jsonRpc', 'prodooSync', '$notification', 'prodooPrint', 'prodooMachine', '$timeout', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, prodooMachine, $timeout) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    $scope.workcenter = $state.params.workcenter;
    var destroy = prodooSync.syncData(
      { workcenter: $scope.workcenter, 
        current_list: function() {  return formatCurrentIds($scope.sync.data)},
      },
      // {
      //   workcenter: $scope.workcenter,
      //   current_list: formatCurrentIds
      // }, 
      $scope.sync
    );
    $scope.$on('$destroy', destroy);

    $scope.fields = [];
    $scope.sameLotNumber = [];

    // scrap local item
    $scope.scrap = {add: false};

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        newVal._v = newVal._v || {};
        newVal._v.started = false; //re-init if user had clicked to another task and he is back now.
        // it should restart the start trigger

        newVal._v.resign_reasons = false; //init the variable to be in a stable state
        // when changing WO withot submitting the form

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

          
          newVal._v.suggestedRacks = createArray(newVal.number_of_lines).map(function (useless, idx) { //for (idx in 1..5)
            
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
          newVal._v.scans = createArray(newVal.number_of_lines).map(function () {
            //if item.components is [ {name: 'tissu'}, { name:'profile'}]
            // and item.qty = 2
            // then scans whould be [ [null, null], [null, null]]

            return createArray(newVal.components.length);
          });
      
        if (!newVal._v.locks) //do it only once (because some lines may be terminated )
          newVal._v.locks = createArray(newVal.number_of_lines).map(function () { return false; });
        
        //do it each time
        newVal._v.lines = createArray(newVal.number_of_lines).map(function (unused, idx) {
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

        if (!newVal._v.raw_materials) {
          //do it once because user may have scanned something
            newVal._v.raw_materials = {}
            newVal._v.raw_materials.expected = newVal.raw_materials_expected;
        }
        if (newVal.scrap_managment) {
          $scope.searchScrap(newVal);
        }
        
    });

    $scope.checkLocks = function () {
    //check if there is some lines still locked
    //usefull because the "ok" buttn should be disabled otherwise
      if (!$scope.sync.current.item)
        return false;

      if (!$scope.sync.current.item._v)
        return false;

      return $scope.sync.current.item._v.lines.filter(function (l ){ return l.lock==false; }).length !== 0;
    };

    $scope.book = function(item) {
      //assign the task to the current workcenter
      item._v.lock = true;
      jsonRpc.call('mrp.workorder', 'prodoo_book', [item.id]).then(function () {
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

    $scope.printAfterScan = function(item,grid, idx){
      if (!item.enablePrintAfterScan){
        return true;
      } else {
        return grid[idx].$valid;
      }
    }

    $scope.$watch('line.rack', function (newVal) {
      //basically when a search is performed in oderList.html
      if (newVal)
        $scope.scrap.search = false;
    });

    $scope.do = function(item) {
      $notification('Pending');
      item._v.lock = true;

      //get back rack in item
      item.rack = item._v.lines.map(function (r) {
        return r.rack; 
      });

      jsonRpc.call('mrp.workorder', 'prodoo_action_done', [item.id, item.rack ]).then(function () {
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

    $scope.$watch('scrap.add', function (newVal) {
      //basically when a search is performed in oderList.html
      if (newVal)
        $scope.scrap.search = false;
    });

    $scope.addScrap = function(item) {

      $notification('Saving scrap');

      jsonRpc.call('mrp.workorder', 'scrap_add', [item.id,$scope.scrap]).then(function () {
        $notification('Scrap saved');
        // clear scrap data
        $scope.scrap = {add: false};
      }, function () {
        $notification('an error has occured');
      });

    };

    $scope.searchScrap = function(item) {
      
      $scope.scrap.add = false
      
      $notification('Searching scrap');
      jsonRpc.call('mrp.workorder', 'scrap_search', [item.id,$scope.scrap]).then(function (data) {
        $scope.scrap.search = true;
        $scope.scrap.avaiable = data;
      }, function () {
        $notification('an error has occured');
      });
      
      return true;
    };

    $scope.useScrap = function(scrapItemtoUse, item) {

      $notification('Take scrap for use');
      jsonRpc.call('mrp.workorder', 'scrap_use', [item.id,scrapItemtoUse]).then(function (data) {
        $scope.scrap.search = false;
        $scope.scrap.add = false;
        $scope.scrap.avaiable = {};
      }, function () {
        $notification('an error has occured');
      });
      
      return true;
    };

    $scope.searchScrapEnter = function(keyEvent) {
      if (keyEvent.which === 13)
        $scope.searchScrap($scope.sync.current.item);
    }

    $scope.eraseScrapSearch = function (status) {
      delete $scope.scrap.material;
      $scope.scrap.canSearch = false;

      $scope.scrap.search = false;
      delete $scope.scrap.avaiable;

      $scope.scrap.add = false;
    };

    $scope.print = function (item, qte) {
        $notification('Printing...');
        prodooPrint(item, qte);
    };

    $scope.machine = function(item) {
        prodooMachine(item);
    };

    $scope.openInNewTab = function(item) {
      var prep_url = item.quality_form_url;
      var suffix = '';
      if (item.quality_form_order_number_id) {
          suffix = item.quality_form_order_number_id+'='+item.lot_number;
      }
      window.open(prep_url+suffix, '_blank');
    };

    $scope.take = function(item) {
      item._v.lock = true;
      jsonRpc.call('mrp.workorder', 'book', [[item.id], $scope.workcenter]).then(function (hasSucceed) {
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

    $scope.start = function(item) {
      //monitor the begin of each work operation
      //the end of the work operation managed by odoo during prodoo_action_done
      item._v.started = true;
      //don't block the user with a sync request
      //we won't wait any response
      jsonRpc.call('mrp.workorder', 'prodoo_action_start', [item.id]);
    }

    $scope.resign = function (item, reason) {
      //user says he can't continue the process,
      // he must choose between a list of options
      jsonRpc.call('mrp.workorder', 'prodoo_action_resign', [item.id, reason]);
      item._v.started = false;
      item.resign_reason = reason;
    }

    $scope.rawMaterialScan = function(item) {
      var input = item._v.raw_materials.input
      var expected = item._v.raw_materials.expected
      var found = expected.filter(function (mat) {
        return mat.barcode == input;
      });
      if (found.length) {
        found[0].scanned = true;
      } else {
        console.error('Material not found');
      }
      item._v.raw_materials.input = ''; // erase field
    };

    function fetchPdf(item) {
      // load a pdf async
      return item._v.labels || jsonRpc.call('mrp.workorder', 'get_pdf', [item.id]).then(function (d) {
        item._v.labels = d;

      });
    }

    function createArray(length) {
      // create and fill with null an array of length
      // (Array.prototype.fill() is not ready yet / polyfill instead :
      var a = [], l = 0;
      for (l = 0; l < length; l++) {
        a.push(null);
      }
      return a;
    }
    function formatCurrentIds(array) {
      var current_ids = [];
      if (array != null){
        if (array.length > 0) {
          for (var i = 0; i < array.length; i++) {
            current_ids.push(array[i].id)
          } 
          return current_ids
        } else {
          return []
        }
      } else {
        return []
      }

    }
}]);
