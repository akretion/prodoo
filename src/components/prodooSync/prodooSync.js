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
		domain: [['workcenter_id', '=', options.workcenter ]],
		limit: 50,
		interval: prodooConfig.refreshInterval,
	});

 	sync.liste.watch(function (e) {
		console.log(sync.liste.data, objectRef);
		//objectRef.data.splice(0, objectRef.data.length);
		objectRef.data = [];
		var item, key;
		for(key in sync.liste.data) {
			item = sync.liste.data[key];
			if (item.sequence < objectRef.current.item.sequence && item.state != 'done')
				objectRef.current.item = item;

			objectRef.data.push(item);
		}
	});

	return sync.liste.stopCallback;
 	};



	return sync;
	}];

	return this;
}])
