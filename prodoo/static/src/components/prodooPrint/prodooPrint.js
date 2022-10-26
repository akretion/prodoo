'use strict';

angular.module('prodapps').provider('prodooPrint',[ function prodooPrintProvider() {

    this.$get = ['$http', 'prodooConfig', 'Beep', function ($http, prodooConfig, Beep) {
            return function (payload, qte) {
                payload._v.labels.forEach(function (label) {
                    var req = {
                        args: [label['printer'], label['data']],
                        kwargs: { options : { 'copies': (qte) ? qte : payload.quantities }}
                    };
                    Beep.play();
                    $http.post(prodooConfig.pyWebDriver+'/cups/printData', req);
                    console.log('print !!!!', payload);
                });
            };
    }];

    return this;
}])
