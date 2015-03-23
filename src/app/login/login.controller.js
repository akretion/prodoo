'use strict';

angular.module('prodapps')
  .controller('LoginCtrl', function ($scope) {
    $scope.login = function () {
      console.log($scope.bucheUsername);
      console.log($scope.buchePassword);
    }
  })
