'use strict';
angular.module('odoo', []);

'use strict';
angular.module('odoo').provider('jsonRpc', function jsonRpcProvider() {

	this.odooRpc = {
		context: {'lang': 'fr_FR'},
		errorInterceptors: []
	};

	var preflightPromise = null;

	this.$get = ["$http", "$q", "$timeout", function($http, $q, $timeout) {

		var odooRpc = this.odooRpc;

		/**
		* login
		* @return promise
		*		resolve promise if credentials ok
		*		reject promise if credentials ko (with {title: wrong_login})
		*		reject promise in other cases (http issues, server error)   
		*/
		odooRpc.login = function(login, password) {
			return $http.get('/web/login', {withCredentials: true}).then(function (odooLogin) {

				var body = odooLogin.data;
				const parser = new DOMParser();
				var parsed = parser.parseFromString(body, 'text/html');
				var input = parsed.querySelector('form');
				var csrf = input["csrf_token"].value;
				var data = 
				encodeURIComponent("login") + '=' + encodeURIComponent(login) + '&' +
				encodeURIComponent("password") + '=' + encodeURIComponent(password) + '&' +
				encodeURIComponent("csrf_token") + '=' + encodeURIComponent(csrf);
				return odooRpc.sendRequest(
					odooLogin.config.url, {},  {
						'method' : 'POST',
						'url' : odooLogin.config.url,
						'data' : data,
						'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
					}
				);
			});
		};

		/**
		* check if logged in or not
		* @return boolean || promise
		*
		*/
		odooRpc.isLoggedIn = function () {
			return odooRpc.getSessionInfo().then(function (result) {
				return !!(result.uid); 
			});
		};

		/**
		* logout (delete cookie)
		* @param force
		*		if true try to connect with falsy ids
		* @return null || promise 
		*/
		odooRpc.logout = function (force) {
			if (force)
				return odooRpc.getSessionInfo().then(function (r) { //get db from sessionInfo
					if (r.db)
						return odooRpc.login(r.db, '', '');
				});
			return $q.when();
		};

		odooRpc.searchRead = function(model, domain, fields) {
			var params = {
				model: model,
				domain: domain,
				fields: fields
			}
			return odooRpc.sendRequest('/web/dataset/search_read', params);
		};

		odooRpc.getSessionInfo = function(model, method, args, kwargs) {
			return odooRpc.sendRequest('/web/session/get_session_info', {});
		};

		odooRpc.getServerInfo = function(model, method, args, kwargs) {
			return odooRpc.sendRequest('/web/webclient/version_info', {});
		};

		odooRpc.syncDataImport = function(model, func_key, base_domain, filter_domain, limit, object, current_list) {
			return odooRpc.call(model, 'get_sync_data', [
				func_key, object.timekey, base_domain, filter_domain, limit, current_list
			], {}).then(function(result) {
					//if (object.timekey === result.timekey) TODO: add mutlidomain before uncomment
					// return; //no change since last run
					object.timekey = result.timekey; 
					
					angular.forEach(result.remove_ids, function(id) {
						delete object.data[id];
					});

					if (Object.keys(result.data).length) {
						angular.merge(object.data, result.data); ///merge deeply old with new
						return odooRpc.syncDataImport(model, func_key, base_domain, filter_domain, limit, object);
					}
			});
		};

		odooRpc.syncImportObject = function(params) {
			/* params = {
					model: 'odoo.model',
					func_key: 'my_function_key',
					domain: [],
					limit: 50,
					interval: 5000,
					}

			 When an error happens, the sync cycle is interrupted.

			 An optional parameter 'onErrorRetry' can be specified. If its value is
			 true, then the sync cycle will continue on the next interval even when
			 errors occur. For a more fine-grained control over the retries,
			 'onErrorRetry' could also be a function, taking the error as argument.
			 It should call 'nextSync()' on the synchronized object's API to delay
			 the next sync iteration.

			 Example:

				params = {
					...
					onErrorRetry: function(sync, err) {
						if(shouldRetry(err)) {
							sync.nextSync();
						}
					}
					}

			 return a synchronized object where you can access
			 to the data using object.data
			*/
			var stop = false;
			var watchers = [];
			var object = { 
				data: {}, 
				timekey: null, 
				stopCallback: function () {
					stop = true;
				},
				watch: function(fun) {
					watchers.push(fun);
				},
				nextSync: nextSync
			};

			function nextSync(interval) {
				if(!stop) {
					$timeout(sync, interval || params.interval);
				}
			}

			function runWatchers(data) {
				watchers.forEach(function (fun) {
					fun(object);
				});
			}

			var errorCallback = null;
			if(angular.isFunction(params.onErrorRetry)) {
				errorCallback = function(err) { params.onErrorRetry(object, err); };
			} else if(params.onErrorRetry) {
				errorCallback = function(err) { nextSync(); };
			}

		function sync() {

				odooRpc.syncDataImport(
					params.model,
					params.func_key,
					params.base_domain,
					params.filter_domain,
					params.limit,
					object,
					params.current_list())
				.then(nextSync)	
				.then(runWatchers)
				.catch(errorCallback);
			}
			sync();

			return object;
		};

		odooRpc.call = function(model, method, args, kwargs) {

			kwargs = kwargs || {};
			kwargs.context = kwargs.context || {};
			angular.extend(kwargs.context, odooRpc.context);

			var params = {
				model: model,
				method: method,
				args: args,
				kwargs: kwargs,
			};
			return odooRpc.sendRequest('/web/dataset/call_kw', params);
		};


		/**
		* base function
		*/
		odooRpc.sendRequest = function(url, params, forceReq=undefined) {

			/** (internal) build request for $http
			* keep track of uniq_id_counter
			*/
			function buildRequest(url, params) {

				var json_data = {
					jsonrpc: '2.0',
					method: 'call',
					params: params, //payload
				};
				var headers = {
					'Content-Type': 'application/json',
				}
				return {
					'method' : 'POST',
					'url' : url,
					'data' : JSON.stringify(json_data),
					'headers': headers,
				};
			}

			/** (internal) Odoo do some error handling and doesn't care
			* about HTTP response code
			* catch errors codes here and reject
			*	@param response $http promise
			*	@return promise 
			*		if no error : response.data ($http.config & header stripped)
			*		if error : reject with a custom errorObj
			*/
			function handleOdooErrors(response) {
				
				var error = response.data.error;
				var errorObj = {
					title: '',
					message:'',
					fullTrace: error
				};
				var ct = response.headers()['content-type'];
				if (ct.startsWith("text/html")) {
					if(response.status === 200) {
						//here we do not know from the request
						//if loggin is successfull
						//search in the rseponse
						
						const parser = new DOMParser();
						var parsed = parser.parseFromString(response.data, 'text/html');
						var canary = parsed.querySelector('.o_web_client')
						if (canary) {
							//no error
							return response.data;
						} else {	
							errorObj.title = "Not Logged";
							errorObj.message = "Not logged";				
						}
					} else {
						errorObj.title = "Unkown Error";
						errorObj.message = "Mal formatted return from server";	
					}
				} else if (ct.startsWith("application/json")) {
					error = response.data.error;
					errorObj["fullTrace"] = error;
					if (!error) {
						// no error
						return response.data.result;
					}
					if (error.code == 100) {
						if (error.data.name === "odoo.http.SessionExpiredException") {
							errorObj.title ='SessionExpired';
							errorObj.message = error.data.message;
						}
					} else if (error.code == 200) {
						if (error.data.name === "odoo.exceptions.AccessError") {
							errorObj.title = 'AccessError';
							errorObj.message = error.data.message;	
						} else if (error.data.name === "odoo.exceptions.UserError") {
							errorObj.title = 'UserError';
							errorObj.message = error.data.message;
						} else if (error.data.name === "werkzeug.exceptions.NotFound") {
							errorObj.title = 'page_not_found';
							errorObj.message = 'HTTP Error';	
						}
					}
				}
				odooRpc.errorInterceptors.forEach(function (i) {
					i(errorObj);
				});
				console.log('on reject !');
				return $q.reject(errorObj)
			}

			/**
			*	(internal)
			*	catch HTTP response code (not handled by Odoo ie Error 500, 404)
			*	@params $http rejected promise
 			*	@return promise
			*/
			function handleHttpErrors(reason) {
				var errorObj = {title:'http', fullTrace: reason, message:'HTTP Error'};
				odooRpc.errorInterceptors.forEach(function (i) {
					i(errorObj);
				});
				return $q.reject(errorObj);
			}

			/**
			*	(internal) wrapper around $http for handling errors and build request
			*/
			function http(url, params, forceReq) {
				var req;
				if (forceReq) {
					req = forceReq;
				} else {
					req = buildRequest(url, params);
				}
				return $http(req).then(handleOdooErrors, handleHttpErrors);
			}

			
			return http(url, params, forceReq);
		}

		return odooRpc;
	}];

});

