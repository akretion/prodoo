'use strict';

angular.module('prodapps').provider('prodooMachine',[ function prodooMachineProvider() {

    this.$get = ['$http', 'prodooConfig', 'Beep', function ($http, prodooConfig, Beep) {
            return function (payload, qte) {
                var req = payload.machine;
                Beep.play();
                $http.post(prodooConfig.pyWebDriver+'/hw_proxy/serial_write', req);
                console.log('Test !!!!', payload);
            };
    }];

    return this;
}])
