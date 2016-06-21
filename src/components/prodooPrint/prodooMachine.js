'use strict';

angular.module('prodapps').provider('prodooMachine',[ function prodooMachineProvider() {

    this.$get = ['$http', 'prodooConfig', 'Beep', function ($http, prodooConfig, Beep) {
            return function (payload, qte) {
                var req = payload.machine;
                Beep.play();
                console.log('Test !!!!', payload);
                if (req.type == 'serial') {
	                $http.post(prodooConfig.pyWebDriver+'/hw_proxy/serial_write', req);
                } else if (req.type == 'url') {
                	$http.post(req.url, req.data);
                }
            };
    }];

    return this;
}])
