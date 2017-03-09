if(typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
	module.exports = 'airagServices';
}
(function(angular) {
	angular.module('airagServices', [])
		.factory('tokenHttp', ['$q', '$http', '$localStorage', function($q, $http, $localStorage) { //注册token http请求服务
			var tokenHttp = function(params) {
				var deferred = $q.defer();
				var promise = deferred.promise;

				var token_params = $.param({
					'client_id': 'test',
					'client_secret': 'test',
					'grant_type': 'test',
					'username': 'test',
					'password': 'test',
				});
				var access_token;
				try {
					access_token = $localStorage.access_token;
				} catch(e) {}

				var requestToken = function(callback) {
					$http({
						url: "/ae/oauth/token?" + token_params,
						method: 'post'
					}).success(function(res_token) {
						access_token = res_token.access_token;
						$localStorage.access_token = access_token;
						callback(access_token);
					}).error(function(error) {
						callback(null, null);
						deferred.reject(error);
					});
				}

				var requestApi = function(access_token) {
					params.method = params.method || 'get';
					if(params.method == "get") {
						if(params.url.indexOf("?") > -1) {
							params.url = params.url + "&_random=" + new Date().getTime();
						} else {
							params.url = params.url + "?_random=" + new Date().getTime();
						}
					}
					if(params.url.indexOf("?") > -1) {
						params.url = params.url + "&access_token=" + access_token;
					} else {
						params.url = params.url + "?access_token=" + access_token;
					}
					if(params.method == "delete") {
						params.headers = {
							'Content-Type': 'application/json'
						};
					}
					$http(params).success(function(res) {
						if(res && res.code == 0) {
							deferred.resolve(res.obj);
						} else {
							deferred.reject(res || '链接有点小问题，刷新再试试！');
						}
					}).error(function(error) {
						if(error && error.error == "invalid_token") {
							requestToken(params, function(params, access_token) {
								requestApi(params, access_token);
							})
						} else {
							deferred.reject(error);
						}
					});
				}
				if(access_token) {
					requestApi(access_token);
				} else {
					requestToken(function(access_token) {
						requestApi(access_token);
					});
				}
				return promise;
			};
			return tokenHttp;
		}])
}(angular))