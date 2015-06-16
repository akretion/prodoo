'use strict';

/*
 * set validity of current input / form based on ensure-value attrs
 *
 * ex: <input ensure-value="123" ng-model="myval">
 *  input is valid only if myval == '123'
*/
angular.module('prodapps').directive('ensureValue', [function() {
  return {
    require: 'ngModel',
    link: function($scope, el, attrs, ngModel) {
      attrs.$observe('ensureValue', function (value) {
        //because when you switch between tasks (order), attrs.ensureValue is changed
        //AFTER $validator callback and therefor check against the old value
        //$scope.$parent.scan may be better written with less dependencies
        ensure($scope.$parent.scan[$scope.$index], value);
      });

      ngModel.$validators.ensureValue = function (value) {
        return ensure(value, attrs.ensureValue);
      };

      function ensure(val1, val2) {
        //adjust setValidity if val1 == val2
        var ret = val1 === val2;
        ngModel.$setValidity('ensureValue', ret);
        return ret;
      }
    }
  };
}]);
