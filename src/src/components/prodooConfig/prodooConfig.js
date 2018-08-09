'use strict';

angular.module('prodapps').provider('prodooConfig', [ function prodooConfigProvider() {
    this.config = {
        odooServer: '/odoo/',
        db: 'sd_production',
        refreshInterval: 5000,
        fetchLimit: 50,
        pyWebDriver:'https://localhost',
        displayLimit: 50
    };

    this.$get = [function () {
            return this.config;
    }];

    return this;
}])
