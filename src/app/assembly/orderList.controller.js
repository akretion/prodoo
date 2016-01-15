'use strict';
angular.module('prodapps')
.controller('OrderListCtrl', ['$scope', 'limitToFilter', 'filterFilter', 'orderByFilter', 'prodooConfig', '$ionicScrollDelegate', '$timeout', function ($scope, limitToFilter, filterFilter, orderByFilter, prodooConfig, $ionicScrollDelegate, $timeout) {
    //scope.sync is inherited by parent scope (assemblyCtrl)
    $scope.filteredList = { done: [], notDone: []};

    $scope.$watch('sync.data', function (newVal, oldVal, scope) {
      //refresh list of order (in the right pane)
      //all items are present in DOM at time
      //one list is shown while the others not
      //limit size of shown item down to prodooConfig.displayLimit : less DOM Injection, less $animate running, better perf
        if (newVal == oldVal)
            return; //TODO comprendre pourquoi on tombe jamais là
        buildFilteredList(); 
    });

    $scope.$watch('sync.current.filter.lot_number', function (newVal) {
        //basically when a search is performed in oderList.html
        if (newVal)
           builFilteredListSearch();
    });

    //catch do() from assemblyCtrl
    $scope.$on('syncAfterDone', function(evt, item) {
        buildFilteredList();
        goToNextTask(item);
    });

    //There is 3 lists of items in DOM : toDo, done, search results
    function buildFilteredList() {
        $scope.filteredList = {
            done : filterAndOrder($scope.sync.data, {state: 'done'}),
            notDone : filterAndOrder($scope.sync.data, {state: '!done'}),
        };
        if ($scope.sync.current.filter.lot_number)
            builFilteredListSearch();
    }

    //Build the search results list
    function builFilteredListSearch() {
        //the guy search for a lot_number
        //  if this lot_number is not found : display nothing
        //  else (if one item found with lot_number)
        //      show all workorwers with the same sale_name that this item
        //      select (clickTask) the item

        //work on a copy
        var filter = angular.copy($scope.sync.current.filter);
        var lot_number = filter.lot_number;
        delete filter.lot_number; //we don't search on this field
        //but on sale_name;

        //search for the item with same lot_number
        $scope.sync.data.some(function(item) {
            if (item.lot_number != lot_number)
                return false;
            //found the item
            filter.sale_name = item.sale_name;
            return true;
        });

        if (!filter.sale_name)
            return $scope.filteredList.search = []; //no need to continue

        $scope.filteredList.search = filterAndOrder($scope.sync.data, filter);

        //is selected item already in search restults ? (from a previous search)
        if ($scope.sync.current.item.sale_name == filter.sale_name)
            return;

        //click on the good one
        $scope.filteredList.search.some(function (item) {
            if (item.lot_number != lot_number)
                return false

            $scope.clickTask(item);
            return true;
        });
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

        if (filter.sale_name || filter.lot_number) {
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
        if (!item)
            return;

        //set to current
        $scope.sync.current.item = item;

        //scroll to item
        if (!$scope.sync.current.filter.sale_name)
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
        if (status === 'eraseSearch') {
            delete $scope.sync.current.filter.sale_name;
            delete $scope.sync.current.filter.lot_number;
        }
        $ionicScrollDelegate.$getByHandle('leftScroll').scrollTop();
        $ionicScrollDelegate.$getByHandle('rightScroll').scrollTop();
    };

}]);