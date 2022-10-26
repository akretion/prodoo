'use strict';

angular.module('prodapps')
  .controller('ConfigurationCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.config = JSON.parse(window.localStorage.getItem('config')) || {};

    // angular.element('#barcode').trigger('focus');

    $scope.save = function() {
      window.localStorage.setItem('config', JSON.stringify($scope.config));
    };
}]);