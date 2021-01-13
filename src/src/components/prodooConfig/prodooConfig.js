'use strict';

angular.module('prodapps').provider('prodooConfig', [ function prodooConfigProvider() {
    this.config = {
        odooServer: '/odoo',
        db: 'sd_production',
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

            if (localConfig.odooServer != null && localConfig.odooServer != '' && localConfig.odooServer != undefined)
            {
                console.log('override odooServer');
                this.config.odooServer = localConfig.odooServer;
            };
            if (localConfig.pyWebDriver != null && localConfig.pyWebDriver != '' && localConfig.pyWebDriver != undefined)
            {
                console.log('override pyWebDriver');
                this.config.pyWebDriver = localConfig.pyWebDriver;
            };
            return this.config;
        };
        
    }];

    return this;
}])