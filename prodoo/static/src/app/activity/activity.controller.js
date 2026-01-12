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
                $scope.startDate = new Date(Date.parse(x.start_date));
                $scope.endDate = new Date(Date.parse(x.end_date));
                $scope.totalQty = 0;
                $scope.activities = x.activities.map(function(activity) {
                    activity.start = new Date(Date.parse(activity.start));
                    $scope.totalQty+= activity.qty;
                    return activity;
                });
                $scope.pauses = x.pauses;

                if ($scope.endDate && $scope.startDate) {
                    var diff_in_sec = ($scope.endDate - $scope.startDate / 1000);
                    $scope.duration = Math.round(diff_in_sec/(60*60)) +  'h ' + Math.round(diff_in_sec/60) + 'min'  
                }

                refreshCounter();
            }
        );
    }

    function refreshCounter() {
          // $scope.$watch may be ?
        $scope.totalPauses = $scope.pauses.reduce(function( acc, current) {
            return acc + current.duration;
        }, 0);
    }

    $scope.getUserActivity();

  }]
);
