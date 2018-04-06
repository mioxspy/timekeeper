'use strict';

/**
 * @ngdoc overview
 * @name uiApp
 * @description
 * # uiApp
 *
 * Main module of the application.
 */
var app = angular.module('uiApp', 
  [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'datatables',
    'datatables.columnfilter',
    'datatables.light-columnfilter'
  ]);

app.config(['$qProvider','$stateProvider', 
        '$urlRouterProvider', '$locationProvider', '$mdThemingProvider',
    function($qProvider, $stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $qProvider.errorOnUnhandledRejections(false); // DataTable Fixed Error  https://github.com/angular-ui/ui-router/issues/2889
    $urlRouterProvider.otherwise('/app/dashboard/index');

    $stateProvider
        .state('app', {
            url: '/app',
            templateUrl: 'views/template/app.html',
            abstract: true
        })
        .state('app.dashboard', {
            url: '/dashboard',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.dashboard.index', {
            url: '/index',
            templateUrl: 'views/index.html',
            data: { pageTitle: 'Dashboard' }
        })
        .state('member', {
            url: '/member',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('member.login', {
            url: '/login',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('member.login.index', {
            url: '/index',
            data: { pageTitle: 'Login' },
            templateUrl: 'views/employee/login.html'
        })
        .state('app.employee', {
            url: '/employee',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.employee.config', {
            url: '/config',
            data: { pageTitle: 'Manage User' },
            templateUrl: 'views/employee/config.html',
            requiresAuthentication: true,
            permissions: ['create users','update users', 'view users']
        })
        .state('app.employee.roles', {
            url: '/roles',
            data: { pageTitle: 'Manage User Roles' },
            templateUrl: 'views/employee/roles.html',
            requiresAuthentication: true,
            permissions: ['create roles','update roles', 'view roles']
        })
        .state('app.employee.dailylogs', {
            url: '/daily/logs',
            data: { pageTitle: 'Daily Logs' },
            templateUrl: 'views/employee/dailylogs.html',
            requiresAuthentication: true,
            permissions: ['view profile','update profile']
        })
        .state('app.employee.logs', {
            url: '/time/logs',
            data: { pageTitle: 'Employee Logs' },
            templateUrl: 'views/employee/logs.html',
            requiresAuthentication: true,
            permissions: ["view logs", "view profile"]
            /*resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'bower_components/datatables/media/css/dataTables.bootstrap.min.css',
                            'bower_components/datatables/media/js/dataTables.bootstrap.min.js'
                        ]
                    });
                }]
            }*/
        })
        .state('error', {
            url: '/error',
            data: { pageTitle: '404 Error' },
            templateUrl: 'views/extra_404_error.html'
        });
        $locationProvider.hashPrefix('');

        $mdThemingProvider.theme('default')
        .primaryPalette('teal', { 'default': '700'})
        .accentPalette('orange')
        .warnPalette('red');

}]);

app.constant('AUTH_EVENTS', {
   notAuthenticated: 'auth-not-authenticated'
});

app.run(['$rootScope', '$state', 'setting', 'AuthService', '$cookies', '$http', '$location', '$window', '$mdToast',
    function($rootScope, $state, setting, AuthService, $cookies, $http, $location, $window, $mdToast) {

    $rootScope.$state = $state;
    $rootScope.setting = setting;

    $rootScope.nodeport = 2000;
    $rootScope.host = $location.protocol() + '://' + '192.168.40.159' + ':' + $rootScope.nodeport;
    $rootScope.loginDetails = {
        username: 'andrew',
        password: '123456'
    };

    $rootScope.previousPage = "";
        
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {

         /*if (!AuthService.checkPermissionForView(next)){
            event.preventDefault();
            $state.go('app.error.401');
            console.log("checkPermissionForView == false")
        }*/

        //check if the status of the user is active
        AuthService.checkUserStatus().then(function(response){ 
            if (next.authenticate && !AuthService.isAuthenticated()) {
                if (next.authenticate == true) {
                    $rootScope.previousPage = fromState.name;
                    event.preventDefault();
                    $state.go('app.dashboard.v1');
                    $rootScope.setting.layout.pageTopMenu = true;
                    $rootScope.setting.layout.pageWithoutSidebar = true;
                    $rootScope.setting.layout.pageBgWhite = true;
                    $rootScope.displayToast('error','Please login');
                    
                }
            } else {
                if (next.allowedRoles && next.allowedRoles.length > 0) {
                    if (next.superAdminOnly) {
                        if (!$rootScope.roleFlags.isSuperAdmin) {
                            event.preventDefault();
                            $state.go('app.error.401');
                        }
                    } else {
                        var rolesPassed = 0;
                        for (var i=0; i<next.allowedRoles.length; i++) {
                            if ($rootScope.roleFlags[next.allowedRoles[i]] == true) {
                                rolesPassed++;
                            }
                        }
                        
                        if (rolesPassed == 0) {
                            event.preventDefault();
                            $state.go('app.error.401');
                        }
                    }
                }else{
                    if (!AuthService.checkPermissionForView(next)){
                        event.preventDefault();
                        $state.go('app.error.401');
                    }
                }
            }
        }); 
    });

     //$rootScope global functions
    $rootScope.reloadState = function () {
        $state.go($state.current, {}, {reload:true});
    };
    
    $rootScope.displayToast = function(type, msg) {

        $mdToast.show({
              hideDelay   : 3000,
              position    : 'bottom right',
              template:
            '<md-toast>' +
              '<div class="md-toast-content '+type+'">' +
                '' +msg+ ''+
              '</div>' +
            '</md-toast>'
        });
    }


}]);
