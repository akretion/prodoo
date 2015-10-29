'use strict';

angular.module('prodapps').factory('apps', ['jsonRpc', function(jsonRpc) {
	//load list of workcenters and apps
	//return a {workcener: [], groups {}}

	return jsonRpc.call('mrp.workcenter', 'prodoo_get_workcenter', []).then(function (data) {
        var workcenters = data;
        var groups = {};

        workcenters.forEach(function (w) {
            if (!groups[w.group])
                groups[w.group] = [];
            groups[w.group].push(w);
        });
        return { workcenters: workcenters, groups: groups};
    });
}]);