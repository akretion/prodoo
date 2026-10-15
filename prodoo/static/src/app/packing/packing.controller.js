'use strict';

angular.module('prodapps')
.controller('PackingCtrl', ['$scope', '$state', 'jsonRpc', 'prodooSync', '$notification', 'prodooPrint', 'prodooMachine', '$timeout', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, prodooMachine, $timeout) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    $scope.workcenter = $state.params.workcenter;
    var destroy = prodooSync.syncData(
      { workcenter: $scope.workcenter,
        method: 'get_sync_packing_data',
        current_list: function() {  return formatCurrentIds($scope.sync.data)},
      },
      $scope.sync
    );
    $scope.$on('$destroy', destroy);
    
    $scope.scan = { enableConfirm: false}

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        newVal._v = newVal._v || {};

        //some values needs to be calculated once, because the user may
        //start to fill the form
        //go to another task (complete it)
        //go back to the first task (and we don't want to loose any data)
        
        if (!newVal._v.lines) {
          //first show of this item. User has not entered anything

          newVal._v.lines = newVal.lines;
        } else {
          //it's not the first time we show this item

          //we don't use references in the view
          //therefor we need to check each time if suggestedRacks has changed
          //BUT entered input has priority over suggestedRacks
        }

    });

    $scope.printAfterScan = function(item,grid, idx){
      if (!item.enablePrintAfterScan){
        return true;
      } else {
        return grid[idx].$valid;
      }
    }

    $scope.do = function(item) {
      console.log('dans do', item)
      
      $notification('Pending');
      item._v.lock = true;
      var scannedLines = item._v.lines.filter( line => {
          return line.scanned
      });
      if (!scannedLines.length) {
        console.error("No scanned lines found to sent")
        return
      }

      console.log(scannedLines, scannedLines.join(","))
      jsonRpc.call('mrp.workorder', 'prodoo_validate_pack', [scannedLines.map(x => x.id)]).then(function (result) {
        var definitePackageName = result
        console.log("result:", result)
        // TODO: grab pack number and set it to scans
        $notification('Done');
        scannedLines.map( (x) => {
          x.package_name = definitePackageName
        })

        // all line scanned = done
        if (item._v.lines.any( line => !line.package_name.length) {
          item.state = 'done';
        }

        $scan.enableConfirm = false; // disallow to send the form
        // need fill up the form to continue
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

    $scope.scanSomething = function(scan) {
      // something is a barcorde of a line.
      if (!scan.scanned) {
        return;
      }
      $scope.sync.current.item._v.lines.map( line => {
        console.log(line.lot_number)
        if (line.lot_number == scan.scanned && !line.package_name) {
          line.package_name = 'PACK'; // placeholder
          line.scanned = true;
          // reset form
          scan.scanned = '';
          scan.error = false;
          scan.enableConfirm = true; // alow to send the form
        }
      })
      if (scan.scanned) {
        //nothing found, display error
        scan.error = true;
      }
    };

    $scope.resetScan = function() {
      $scope.sync.current.item._v.lines.map( line => {
        if (line.scanned) {
          line.package_name = '';
          line.scanned = false;
        }
      })
      $scope.scan.error = false;
      $scope.scan.scanned = '';
      $scan.enableConfirm = false; // disallow to send the form
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
