'use strict';

angular.module('prodapps')
.controller('ActivityCtrl', ['$scope', '$state', 'jsonRpc', function ($scope, $state, jsonRpc) {
 
    $scope.activityLog = null;
    $scope.pauses = null
    $scope.totalPauses = null;
    $scope.loggedUser = "";

    jsonRpc.getSessionInfo().then(function (x) {
        $scope.loggedUser = x.name;
    })

    $scope.getUserActivity = function() {
        jsonRpc.call("mrp.workorder", "prodoo_get_user_activity", [false]).then(
            function (x) {
                $scope.startDate = x.start_date;
                $scope.endDate = x.end_date;
                $scope.activities = x.activities;
                $scope.pauses = x.pauses;

                if (x.start_date && x.end_date) {
                  $scope.duration = x.end_date - x.start_date;
                }

                refreshCounter();
            }
        );
    }

    $scope.addPause = function(duration) {
        //todo: may be add a bit of throttling
        jsonRpc.call("mrp.workorder", "add_pause", [false], {duration: duration}).then(function(x) {
            $scope.getUserActivity();
        });
    };

    $scope.removePause = function(index) {
        // remove pause directly in local first
        $scope.pauses.splice(index, 1);
        jsonRpc.call("mrp.workorder", "remove_pause", [false], {pause_id: index}).then(function(x) {
            $scope.getUserActivity();
        });
    };

    function refreshCounter() {
          // $scope.$watch may be ?
        $scope.totalPauses = $scope.pauses.reduce(function( acc, current) {
            return acc + current.duration;
        }, 0);
    }

    $scope.getUserActivity();

  }]
);
