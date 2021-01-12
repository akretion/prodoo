'use strict';

angular.module('prodapps')
  .controller('MainCtrl', ['$scope', '$state', 'apps', function ($scope, $state, apps) {
    $scope.$state = $state;
    $scope.workcenters = apps.workcenters;
    $scope.groups = apps.groups;

    angular.element('#barcode').trigger('focus');
}]);
