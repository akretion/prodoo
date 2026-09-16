'use strict';

angular.module('prodapps').provider('prodooConfig', [ function prodooConfigProvider() {
    this.config = {
        refreshInterval: 15000,
        fetchLimit: 150,
        pyWebDriver:'https://localhost',
        displayLimit: 150
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
