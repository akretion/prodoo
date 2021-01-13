'use strict';

angular.module('prodapps')
  .controller('TdcpCtrl', ['$scope', '$stateParams', '$state', 'jsonRpc', '$notification', function ($scope, $stateParams, $state, jsonRpc, $notification) {

    $scope.tdcp = {};
    $scope.workcenter = $state.params.workcenter;

    console.log($state.params.workcenter)
    $scope.$watch('tdcp.lot_number', function (newVal) {
      if (newVal)
        searchTDCP(newVal);
    });

    function searchTDCP(lot_number) {
      $notification('searchin for TDCP');
      if ($scope.workcenter == 0) {
        var model = 'mrp.production';
        var domain = [
          [
            'name',
            '=',
            lot_number
          ]
        ];
        var fields = [
          'table_tech_description'
        ]
      } else {
        var model = 'mrp.production.workcenter.line';
        var domain = [
          [
            'production_number',
            '=',
            lot_number
          ],
          [
            'workcenter_id', 
            '=', 
            $scope.workcenter
          ]
        ];
        var fields = [
          'name',
          'short_description',
          'description',
        ]
      }


      jsonRpc.searchRead(model, domain, fields).then(function (data) {
        console.log(data);
        $scope.tdcp.search = data.records;
      }, function () {
        $notification('an error has occured');
      });
    }

    $scope.goBack = function(){
      if ($scope.workcenter > 0){
        $state.go('main.assembly', {
          workcenter: $scope.workcenter
        });
      } else {
        $state.go('main.home');
      }
    };

    $scope.clear = function(){
      delete $scope.tdcp.lot_number;
    };

    $scope.eraseSearch = function (status) {
      delete $scope.tdcp.lot_number;
    };
}]);