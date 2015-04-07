'use strict';

angular.module('prodapps').provider('prodooSync', ['prodooConfig', 'jsonRpc', function prodooSyncProvider(prodooConfig, jsonRpc) {

	var sync = {};
	sync.liste = {};

	sync.syncData = function(options, objectRef, current) {

 		sync.liste = jsonRpc.syncImportObject({
			model: 'mrp.production.workcenter.line',
			func_key: 'prodoo',
			domain: options.domain,
			limit: 50,
			interval: prodooConfig.refreshInterval,
		});

 		sync.liste.watch(function (e) {
			console.log('on ma updated',e);
			objectRef = [];
			var item, key;
			for(key in sync.liste.data) {
				item = sync.liste.data[key];
				if (item.sequence < current.item.sequence && item.state != 'done')
					current.item = item;

				objectRef.push(item);
		});

		return sync.liste.stopCallback;
 	};



	this.$get = ['jsonRpc', function (jsonRpc) {
			return sync;
	}];

	return this;
}])