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
      ngModel.$validators.ensureValue = function (value) {
        var ret = value == attrs.ensureValue;
        ngModel.$setValidity('ensureValue', ret);
        return ret;
     };
    }
  };
}]);
