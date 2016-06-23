'use strict';

angular.module('prodapps').provider('prodooMachine',[ function prodooMachineProvider() {

    this.$get = ['$http', 'prodooConfig', 'Beep', function ($http, prodooConfig, Beep) {
            return function (payload, qte) {
                /*
                Drive a remote machine
                - some machines are driven through PyWebDriver
                - some others have their own http interface
                */
                var req = payload.machine;
                Beep.play();
                if (req.type == 'serial') {
                    $http.post(prodooConfig.pyWebDriver+'/hw_proxy/serial_write', req);
                } else if (req.type == 'url') {
                    $http.post(req.url, req.data);
                }
            };
    }];

    return this;
}])
