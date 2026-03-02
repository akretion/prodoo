'use strict';

angular.module('prodapps')
.controller('TeamCtrl', ['$scope', '$state', 'jsonRpc', '$notification', 'teamProvider', function ($scope, $state, jsonRpc, $notification, teamProvider) {
 console.log('team ctrl');

//dirty but it's ok
angular.element('#loginPassword').trigger('focus');

 $scope.tempTeam = [];
 $scope.actualTeam = [];
 console.log($state);
 refreshTeam();

 $scope.addMember = function(loginPassword) {
 	//input is the same bardcode than login: part is username, part is password
 	//we should not diplay password
 	//see login.controller.js
 	console.log('dans addMember', loginPassword)
	var seperator = ' '
    if (!loginPassword)
    	return;
    if (loginPassword.indexOf(seperator) != -1 ) {
        var login = loginPassword.split(seperator)[0];
    } else {
    	//don't succeed to split with separator
    	//fallback to display all
    	var login = loginPassword;
    }
    if ($scope.tempTeam.indexOf(login) == -1) {
    	$scope.tempTeam.push(login);
    }
    $scope.loginPassword = ''; //reset
 };

 $scope.reset = function() {
 	$scope.tempTeam  = [];
 };

 $scope.saveTeam = function(e) {

 	if ($scope.loginPassword) {
 		// if there is text in the field
 		// add it as member and do not send form yet
 		return $scope.addMember($scope.loginPassword);
 	}
 	//will persist data to odoo
    $notification('Saving...');

    teamProvider.set($scope.tempTeam).then(
    	function( x) {
    		console.log('tout c bine passe');
    		refreshTeam();
    		$scope.tempTeam = [];
    	}, function( y) {
    		console.log('shit happens');
    	});
 }

 function refreshTeam() {
 	console.log('on va chercher la liste sur odoo');
 	$scope.actualTeam = teamProvider.members;
 }
}]);



angular.module('prodapps').provider('teamProvider', [ function prodooConfigProvider() {
    var team = {
    	get: null,
    	set: null,
    	members: ['w', 'y', 'zzz'],
    }
    console.log('team provider', this)
    this.$get = ['jsonRpc', function (jsonRpc) {
    	team.get = function() {
    		//fetch the list from odoo
    		return jsonRpc.call('prodoo_team', 'getTeam', []).then(function (members) {
    			console.log('retour depuis odoo');
    			team.members = members;
    			return team.members;
    		}, function (err) {
    			team.members = ['1', '3', '5'];
    			return team.members;
    		});
    	};
    	team.set = function (memberList) {
    		// will persist to odoo the new list
		 	return jsonRpc.call('prodoo_team', 'persistTeam', [memberList]).then(function () {
		        //do the changes
		    }, function () {
		        console.log('ya eu du grabbuge, on persist en local');
		        team.members = memberList;

		    });   		
    	}
    	team.get();
    	return team;
    }];

    return this;
}])
