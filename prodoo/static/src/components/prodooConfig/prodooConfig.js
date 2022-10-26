'use strict';

angular.module('prodapps').provider('prodooConfig', [ function prodooConfigProvider() {
    this.config = {
        refreshInterval: 5000,
        fetchLimit: 50,
        pyWebDriver:'https://localhost',
        displayLimit: 50
    };

    this.$get = [function () {
        var localConfig = JSON.parse(window.localStorage.getItem('config'));

        if (!localConfig){
            return this.config;
        } else {
            return localConfig;
        } 
    }];

    return this;
}])