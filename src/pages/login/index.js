require('./index.css');

var mod = angular.module('login', []);

mod.controller('loginController', ['$scope', '$http', '$localStorage', '$state',  function($scope, $http, $localStorage, $state) {
	$scope.loginData = {};
	
	$scope.login = function(){
		if($scope.loginForm.$valid){
          	var loginData = $scope.loginData;
			$http({
				method : 'POST',
				url: '/ae/register/login',
				data: $scope.loginData,
			}).then(function(res){
				var data = res && res.data || {};
				if( data.code === 0 ){
					$localStorage.logined = true;
					$localStorage.userInfo = data.obj;
					$state.go('index');
				}else{
					alert(data && data.msg || '登录错误');
				}
			}, function(){
				alert('登录错误');
			});
       	}else{
            $scope.submitted = true;
    		}
	}
}]);

module.exports = mod