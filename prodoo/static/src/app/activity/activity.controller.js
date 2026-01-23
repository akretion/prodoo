'use strict';

angular.module('prodapps')
.controller('ActivityCtrl', ['$scope', '$state', 'jsonRpc', function ($scope, $state, jsonRpc) {
 
    $scope.activityLog = null;
    $scope.loggedUser = "";

    jsonRpc.getSessionInfo().then(function (x) {
        $scope.loggedUser = x.name;
    })

    $scope.getUserActivity = function() {
        jsonRpc.call("mrp.workorder", "prodoo_get_user_activity", [false]).then(
    function (x) {
        console.log("Données reçues d'Odoo :", x);

        // 1. On récupère les dates
        $scope.startDate = x.start_date ? new Date(x.start_date.replace(/-/g, '/')) : null;
        $scope.endDate = x.end_date ? new Date(x.end_date.replace(/-/g, '/')) : null;
        
        // 2. On récupère les totaux et les groupes (plus de .map() sur activities !)
        $scope.totalQty = x.total_qty || 0;
        $scope.workcenterGroups = x.workcenter_groups || [];

        // 3. Calcul de la durée corrigé
        if ($scope.endDate && $scope.startDate) {
            // getTime() assure qu'on manipule des nombres (millisecondes)
            var diff_in_sec = ($scope.endDate.getTime() - $scope.startDate.getTime()) / 1000;
            
            var hours = Math.floor(diff_in_sec / 3600);
            var minutes = Math.floor((diff_in_sec % 3600) / 60);
            $scope.duration = hours + 'h ' + minutes + 'min';
        }

    },
);
    }

    $scope.getUserActivity();

  }]
);
