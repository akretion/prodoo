'use strict';

angular.module('prodapps').provider('prodooSync', [function prodooSyncProvider() {

    var sync = {};
    sync.liste = {};

this.$get = ['jsonRpc', 'prodooConfig', function (jsonRpc, prodooConfig) {
    sync.syncData = function(options, objectRef) {
    console.log('options : ', options, objectRef);
     sync.liste = jsonRpc.syncImportObject({
        model: 'mrp.production.workcenter.line',
        func_key: 'prodoo',
        domain: [
            ['workcenter_id', '=', options.workcenter ],
            ['pending', '=', false ]
        ],
        limit: 50,
        interval: prodooConfig.refreshInterval,
    });

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
