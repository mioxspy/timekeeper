'use strict';

/**
 * @ngdoc service
 * @name uiApp.AuthService
 * @description
 * # AuthService
 * Service in the uiApp.
 */
angular.module('uiApp').service('AuthService', function ($window, $q, $http, $rootScope, $cookies) {
	var LOCAL_TOKEN_KEY = 'astitimekeepertoken';
	var LOCAL_USER_INFO = 'atkuser';
	var isAuthenticated = false;
	$rootScope.user = {};
	var authToken;
        $rootScope.showLogout = false;
	$rootScope.roleFlags = {
            isSuperAdmin: false,
            isAdministrator: false,
            isUploader: false,
            isPublic: false
	};
	var permissionList; 
    var plist = [];

	/**
     *  Saves the current user in the root scope
     *  Call this in the app run() method
     */
    /*function init(){
        if ($scope.isLoggedIn == true){
            $rootScope.user = $cookies.getObject('loginUser');
        }
    }*/

	var getPermissionList = function() {
		return $.get($rootScope.host+'/roles/permissions', function(data) {
		    permissionList = data;
		    angular.bootstrap(document, ['myApp']);
		});
	};

    var checkUserPermissions = function(upermission) {
        var plist = [];
         $http.get($rootScope.host+'/roles/permissions')
            .then(function (result) {
                var results = result.data
                // console.log(result.data.indexOf(upermission[2]))
                for (var i = 0; i < upermission.length; i++) {

                    if(results.indexOf(upermission[i]) != -1){
                        var p = upermission[i];
                        var d = { p : true};
                        plist.push(d)
                        console.log(d,'p')
                        
                    }
                }
                console.log(plist,'---plist---')
        });
    };


	//load the token saved in local storage
	function loadUserCredentials() {
		var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if (token) {
			useCredentials(token);
		}
	}

	//store token received from login authentication
	function storeUserCredentials(token) {
		$window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		useCredentials(token);
	}

	//set user credentials
	function useCredentials(token) {
		// console.log('token:', token);
		if (token != undefined) {
			if ($cookies.get('loginUser')) {
				isAuthenticated = true;
				authToken = token;
				//check if user is admin
				checkRole();
				$http.defaults.headers.common.Authorization = authToken;	
			} else {
				isAuthenticated = false;
			}
			
		} else {
			isAuthenticated = false;
		}
		
	}

	//destroy user sessions
	function destryoUserCredentials() {
		authToken = undefined;
		isAuthenticated = false;
		$rootScope.isAdmin = false;
                $rootScope.showLogout = false;
		$http.defaults.headers.common.Authorization = undefined;
                $rootScope.roleFlags = {
			isSuperAdmin: false,
            isAdministrator: false,
            isViewer: false
		};
		// $window.localStorage.removeItem(LOCAL_TOKEN_KEY);
		$window.localStorage.clear();
	}

	function currentUser(){
        if ($cookies.get('loginUser')) {
			$rootScope.user = JSON.parse($cookies.get('loginUser'));
			return $rootScope.user;
		} 
    };

	function checkPermissionForView(view) {
        if (!view.requiresAuthentication) {
            return true;
        }
         
        return userHasPermissionForView(view);
    };
    
    var userHasPermissionForView = function(view){
        if(!isLoggedIn()){
            return false;
        }
         
        if(!view.permissions || !view.permissions.length){
            return true;
        }
         
        return userHasPermission(view.permissions);
    };
     
     
    function userHasPermission(permissions){
        if(!isLoggedIn()){
            return false;
        }
         
        var found = false;
        angular.forEach(permissions, function(permission, index){
            if ($rootScope.user.permissions.indexOf(permission) >= 0){
                found = true;
                return;
            }                        
        });
         
        return found;
    };

    var isLoggedIn = function(){
    	if ($cookies.get('loginUser')) {
			$rootScope.user = JSON.parse($cookies.get('loginUser'));
			return $rootScope.user != null;
		} else {
			isAuthenticated = false;
			return isAuthenticated;
		}
    };

	//login
	var nativelogin = function (credentials) {
            return $q(function (resolve, reject) {

                $http.post($rootScope.host+'/auth/login/native', credentials)
                    .then(function (result) {
                        if (result.data.success == true) {
                        	console.log(result.data)
                            $cookies.putObject('loginUser',result.data.data);
                            storeUserCredentials(result.data.data.token);
                            checkUserPermissions(result.data.data.permissions);

                            // $scope.isLoggedIn = true;
                            checkRole();
                            resolve(true);
                        } else {
                        	// if(result.data.success == false){
                        	// 	// $http.post($rootScope.host+'/api/auth/wrongpass', credentials);
                        	// }
                            reject(result.data);  
                           
                        }
                });
            });
        };

    var checkUserStatus = function () {
    	if ($cookies.getObject('loginUser')) {
    		var user = $cookies.getObject('loginUser');
    		return $q(function (resolve, reject) {
    			$http.post($rootScope.host+'/auth/status', {username: user.username})
    			.then(
    				function success(result) {
    					resolve(result.data.active);
    				}, 
    				function error(err) {
    					reject(err.data.active);
    				}
				);
    		});
    	} else {
    		return $q(function (resolve, reject) {
    			resolve(false);
    		});
    	}
    };

    //set user roles
    var checkRole = function () {
    	if ($cookies.getObject('loginUser')) {
    		var user = $cookies.getObject('loginUser');
    		if (user.roleFlags) {
    			$rootScope.roleFlags = user.roleFlags;
    			$rootScope.roleFlags.isPublic = true;
    		}
    	}
    };    
        
	//logout
	var logout = function () {
		destryoUserCredentials();
	};
        
	return {
		login: nativelogin,
		logout: logout,
		checkRole: checkRole,
		isAuthenticated: function () { loadUserCredentials(); return isAuthenticated; },
		checkUserStatus: checkUserStatus,
		permissionList: getPermissionList,
		userHasPermission: userHasPermission,
		checkPermissionForView: checkPermissionForView
	};
})


.factory('AuthInterceptor', function ($rootScope, AUTH_EVENTS, $q) {
	return {
		responseError: function (response) {
			$rootScope.$broadcast({
				401: AUTH_EVENTS.notAuthenticated
			}[response.status], response);

			return $q.reject(response);
		}
	};
})

.config(function ($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
});
