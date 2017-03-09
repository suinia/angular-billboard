require('./css/main.css');
require('angular'); //angularjs框架
require('angular-ui-router'); //路由
require('ocLazyLoad'); //懒加载
require('ngStorage'); //本地存储
require('./components/common/services.js'); //自定义服务
require('./components/common/filters.js'); //自定义过滤器

var airagBoardApp = angular.module('airagBoard', ['ui.router', 'oc.lazyLoad', 'ngStorage', 'airagServices', 'airagFilters']); //app入口

airagBoardApp.run(['$rootScope', '$localStorage', '$location', function($rootScope, $localStorage, $location){ //初始化全局
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams){ //状态改变绑定事件判断是否登录
		var logined =  $localStorage.logined && $localStorage.userInfo;
		if (!logined && toState.data && toState.data.loginCheck) {
			$location.path('/login');
	   }
	});
}]);

//配置路由
airagBoardApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$logProvider', function($stateProvider, $locationProvider, $urlRouterProvider, $logProvider) {
	//$logProvider.debugEnabled(false);
	$stateProvider
		.state('login', {
			url: '/login',
			templateProvider: ['$q', function ($q) {
				var deferred = $q.defer();
			    require.ensure([], function (require) {
			        var template = require('./pages/login/index.html');
			        deferred.resolve(template);
			    }, 'page.login');
			    return deferred.promise;
	        }],
			controller: 'loginController',
			resolve: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad, $state) {
				var deferred = $q.defer();
				require.ensure([], function(require) {
					var mod = require('./pages/login/index.js');
					$ocLazyLoad.load({
						name: mod.name,
					});
					deferred.resolve();
				}, 'page.login');
				return deferred.promise;
			}]
		})
		.state('index', {
			url: '/',
			templateProvider: ['$q', function ($q) {
				var deferred = $q.defer();
			    require.ensure([], function (require) {
			        var template = require('./pages/index/index.html');
			        deferred.resolve(template);
			    }, 'page.index');
			    return deferred.promise;
	        }],
			controller: 'indexController',
			resolve: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad, $state) {
				$state.go('login');
				var deferred = $q.defer();
				require.ensure([], function(require) {
					var mod = require('./pages/index/index.js');
					$ocLazyLoad.load(mod);
					deferred.resolve();
				}, 'page.index');
				return deferred.promise;
			}],
			data: {
                loginCheck: true
            }
		})
		.state('index.gis', {
			url: 'gis',
			templateProvider: ['$q', function ($q) {
	            var deferred = $q.defer();
			    require.ensure([], function () {
			        var template = require('./pages/gis/index.html');
			        deferred.resolve(template);
			    }, 'page.gis');
			    return deferred.promise;
	        }],
			controller: 'gisController',
			resolve: ['$q', '$ocLazyLoad', function($q, $ocLazyLoad) {
				var deferred = $q.defer();
				require.ensure([], function(require) {
					var mod = require('./pages/gis/index.js');
					$ocLazyLoad.load({
						name: mod.name,
					});
					deferred.resolve(mod.controller);
				}, 'page.gis');
				return deferred.promise;
			}]
		})
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
}]);