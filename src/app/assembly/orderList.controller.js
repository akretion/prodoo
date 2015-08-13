'use strict';
angular.module('prodapps')
.controller('OrderListCtrl', function ($scope, limitToFilter, filterFilter, orderByFilter, prodooConfig, $ionicScrollDelegate, $timeout) {
    //scope.sync is inherited by parent scope (assemblyCtrl)
    $scope.filteredList = [];

    $scope.$watch('sync.data', function (newVal, oldVal, scope) {
      //refresh list of order (in the right pane)
      //all items are present in DOM at time
      //one list is shown while the others not
      //limit size of shown item down to prodooConfig.displayLimit : less DOM Injection, less $animate running, better perf

        if (newVal == oldVal)
            return;

        $scope.filteredList = {
            done : limitToFilter(orderByFilter(filterFilter(newVal, 'done'),'sequence'), prodooConfig.displayLimit),
            notDone : limitToFilter(orderByFilter(filterFilter(newVal, '!done'),'sequence'), prodooConfig.displayLimit),
        };
        if (scope.sync.current.filter.lot_number) {
            $scope.filteredList.search = limitToFilter(orderByFilter(filterFilter(newVal, scope.sync.current.filter),'sequence'),prodooConfig.displayLimit);
        }
    });

    $scope.$watch('sync.current.filter.lot_number', function (newVal, oldVal, scope) {
        if (newVal)
            $scope.filteredList.search = limitToFilter(orderByFilter(filterFilter(scope.sync.data, newVal),'sequence'), prodooConfig.displayLimit);
    });

    $scope.clickTask = function (item) {
        //set to current
        $scope.sync.current.item = item;

        //erase the search
        delete ($scope.sync.current.filter.lot_number);

        //scroll to item
        $timeout(function () {
            var offset =  angular.element('#item'+item.id)[0].offsetTop; //can be put in directive
            $ionicScrollDelegate.$getByHandle('leftScroll').scrollTo(0, offset, true);
            //anchorScroll doesn't work well
        }, 50); //wait dom update
    };


    $scope.setFilter = function (status) {
        if (status === 'toDo')
            $scope.sync.current.filter={state:'!done'};
        if (status === 'done')
            $scope.sync.current.filter={state:'done'};
        if (status === 'eraseSearch')
            delete ($scope.sync.current.filter.lot_number);

        $ionicScrollDelegate.$getByHandle('leftScroll').scrollTop();
        $ionicScrollDelegate.$getByHandle('rightScroll').scrollTop();
    };

});