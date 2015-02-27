'use strict';

angular.module('prodapps')
  .controller('LoginCtrl', function ($scope) {
    $scope.login = function (loginForm) {
      alert('login');
      loginForm.loginInput.$error.doesntExist = true;
    }
  })
