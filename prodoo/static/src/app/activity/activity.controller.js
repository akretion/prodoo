'use strict';

angular.module('prodapps')
.controller('ActivityCtrl', ['$scope', '$state', 'jsonRpc', function ($scope, $state, jsonRpc) {
 
    $scope.activityLog = null;
    $scope.loggedUser = "";
    $scope.reasons = [];
    $scope.selectedReason = null;
    $scope.teamMembers = [];
    $scope.teamLoading = false

    jsonRpc.getSessionInfo().then(function (x) {
        $scope.loggedUser = x.name;
    })

    $scope.getTeam = function(x) {
        $scope.teamLoading = true;
        jsonRpc.call("mrp.team", "get_team", [false]).then(
        function (x) {
            $scope.teamName = x.name;
            $scope.teamMembers = x.members;
            $state.get('login').data.teamName = $scope.teamName;
            $scope.teamLoading = false;
        });
    };
    $scope.rmTeamMember = function(x) {
        console.log("remove user", x);
        var newMembers = $scope.teamMembers.filter( y => y.id != x ).map(function (x) { return x.login});
        $scope.teamLoading = true;        
        jsonRpc.call("mrp.team", "create_team", [false, newMembers]).then(
            function (x) {
                $scope.teamName = x.name;
                $scope.teamMembers = x.members;
                $state.get('login').data.teamName = $scope.teamName;
                $scope.teamLoading = false;
            }
        );
    }
    $scope.addTeamMember = function(x) {
        console.log("call erp instead", x, $scope.teamMembers);
        var newLogin = null;
        var seperator = ' '
        
        if ($scope.newPlayer.indexOf(seperator) != -1 ) {
            //remove password from call
            newLogin = $scope.newPlayer.split(seperator)[0];
        } else { //token based auth
            newLogin = 'based_on_token' + $scope.newPlayer;
        }

        var memberLogins = $scope.teamMembers.map(function (x) { return x.login }).concat(newLogin);
        $scope.teamLoading = true;
        jsonRpc.call("mrp.team", "create_team", [false, memberLogins]).then(
            function (x) {
                $scope.teamName = x.name;
                $scope.teamMembers = x.members;
                $state.get('login').data.teamName = $scope.teamName;
                $scope.newPlayer = "";
                $scope.teamLoading = false;
            }
        );
    }

    $scope.getUserActivity = function() {
        jsonRpc.call("mrp.workorder", "prodoo_get_user_activity", [false]).then(
    function (x) {
        console.log("Données reçues d'Odoo :", x);

        $scope.reasons = x.reasons || [];
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
$scope.setPauseReason = function() {
        if (!$scope.selectedReason) return;
        jsonRpc.call("mrp.workorder", "prodoo_set_pause_reason", [$scope.selectedReason])
            .then(function() {
                alert("Reason updated: " + $scope.selectedReason);
            });
    };
    $scope.getUserActivity();
    $scope.getTeam()

  }]
);
