'use strict';
angular.module('prodapps')
.controller('OrderListCtrl', ['$scope', 'limitToFilter', 'filterFilter', 'orderByFilter', 'prodooConfig', '$ionicScrollDelegate', '$timeout', function ($scope, limitToFilter, filterFilter, orderByFilter, prodooConfig, $ionicScrollDelegate, $timeout) {
    //scope.sync is inherited by parent scope (assemblyCtrl)
    $scope.filteredList = [];

    $scope.$watch('sync.data', function (newVal, oldVal, scope) {
      //refresh list of order (in the right pane)
      //all items are present in DOM at time
      //one list is shown while the others not
      //limit size of shown item down to prodooConfig.displayLimit : less DOM Injection, less $animate running, better perf

        if (newVal == oldVal)
            return;
        buildFilteredList(); 
    });

    $scope.$watch('sync.current.filter.lot_number', function (newVal) {
        if (newVal)
           builFilteredListSearch();
    });

    $scope.$on('syncAfterDone', function(evt, item) {
        buildFilteredList();
        goToNextTask(item);
    });

    function buildFilteredList() {
        $scope.filteredList = {
            done : filterAndOrder($scope.sync.data, 'done'),
            notDone : filterAndOrder($scope.sync.data, '!done'),
        };
        if ($scope.sync.current.filter.lot_number)
            builFilteredListSearch();
    }

    function builFilteredListSearch() {
        $scope.filteredList.search = filterAndOrder($scope.sync.data, $scope.sync.current.filter);
    }

    function filterAndOrder(bigList, filter) {
        return limitToFilter(
                    orderByFilter(
                        filterFilter(bigList, filter),
                    'sequence'),
                prodooConfig.displayLimit);
    }

    function goToNextTask(item) {
        //will determine in wich list we are
        //select the next item
        //(trigger $scope.clickTask)
        var filter = $scope.sync.current.filter;
        var list;
        var nextItem;

        if (!item)
            return;

        if (filter.lot_number) {
            list = 'search';
        } else if (filter.state === 'done') {
            list = 'done';
        } else if (filter.state === '!done') {
            list = 'notDone';
        } else {
            return console.log('etat indefini');
        }

        nextItem = false;
        $scope.filteredList[list].some(function (it) {
            //the list is ordered by sequence
            if (it.sequence <= item.sequence)
                return false;

            nextItem = it;
            return true; //don't continue to iterate
        });

        if (nextItem)
            $scope.clickTask(nextItem);
    }
    
    $scope.clickTask = function (item) {
        //set to current
        $scope.sync.current.item = item;

        //scroll to item
        if (!$scope.sync.current.filter.lot_number)
        //don't scroll if it's a search result
        //because all search results are not in "draft" list
        //we can't scroll to them
            $timeout(function () {
                var offset =  angular.element('#item'+item.id)[0];
                $ionicScrollDelegate.$getByHandle('leftScroll').scrollTo(0, offset.offsetTop, true);
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

}]);