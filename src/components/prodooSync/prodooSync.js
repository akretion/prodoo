'use strict';

angular.module('prodapps').provider('prodooSync', [function prodooSyncProvider() {

    var sync = {};
    sync.liste = {};

    this.$get = ['jsonRpc', 'prodooConfig', function (jsonRpc, prodooConfig) {
        sync.syncData = function(options, objectRef) {
        
            var param = {
                model: 'mrp.production.workcenter.line',
                func_key: 'prodoo',
                base_domain: [
                    ['workcenter_id', '=', options.workcenter]
                ],
                filter_domain: [
                    ['production_state', 'not in', ['draft', 'cancel']],
                    ['full_done', '=', false]
                ],
                limit: prodooConfig.fetchLimit,
                interval: prodooConfig.refreshInterval,
            };

            /*jsonRpc.call(param.model, 'get_foremost_data', [ param.func_key, [].concat(param.base_domain, param.filter_domain), 20]).then(function (d) {               var key;
                objectRef.data = [];
                for(key in d) {
                    objectRef.data.push(d[key]);
                }
            });*/

            sync.liste = jsonRpc.syncImportObject(param);

            sync.liste.watch(function (e) {
                //sync.liste.data is an object
                //we need it as array
                //plus
                //  we want set current.item

                console.log(sync.liste.data, objectRef);
                //objectRef.data.splice(0, objectRef.data.length);
                objectRef.data = [];
                var item, key;
                var candidate = null;
                for(key in sync.liste.data) {
                    item = sync.liste.data[key];

                    objectRef.data.push(item);

                    //set only to task done
                    //choose a candidate with the lowest possible sequence number
                    if (item.state != 'done' && (!candidate || candidate.sequence > item.sequence))
                        candidate = item;
                }

                //if current.item not defined or not present in sync.liste.data (removed)
                //set it to the best candidate
                if (!objectRef.current.item || !sync.liste.data[objectRef.current.item.id]){
                    objectRef.current.item = candidate;
                }
            });

            return sync.liste.stopCallback;
        };

        return sync;
    }];
    return this;
}])
