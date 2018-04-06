'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:MemberLoginCtrl
 * @description
 * # MemberLoginCtrl
 * Controller of the uiApp
 */
angular.module('uiApp').controller('MemberLoginCtrl', function ($mdToast, $scope, $rootScope, $state, AuthService,$cookies, $http, $window) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
 

    $scope.submitForm = function(credentials) {
        AuthService.login(credentials)
        .then(function (result) {
            //console.log(result)

            //set user information cookie
           /* $cookies.put('user',credentials);
            $cookies.putObject('user', credentials);*/
            
            //Get firstname
            $scope.loginInfo = JSON.parse($cookies.get('loginUser'));
            
            //success notification
            $rootScope.displayToast('success', 'Successfully Login');

            //$state.go('app.dashboard.index'); 
            
            
            //redirect to previous page, otherwise redirect to home
            if ($rootScope.previousPage != '' && $rootScope.previousPage != undefined && $rootScope.previousPage != 'app.dashboard.index') {
                $state.go($rootScope.previousPage);
            } else {
                $state.go('app.dashboard.index');     
            }
            
        }, function (err) {
            // console.log(err.message)
            //Failed Notification
            $rootScope.displayToast('error', err.message);
        }); 

    };
    
    $scope.logout = function(){

        AuthService.logout();
        
        $http.get($rootScope.host+'/auth/logout')
            .then(function (response) {
                
                $state.go('member.login.index');
                //$rootScope.displayToast('success', 'Successfully logout');

        }, function (err) {
            console.log(err.message);
            $rootScope.displayToast('error', err.message);
        });

        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });

        $rootScope.credentials = {
            username: '',
            password: ''
        };

        $rootScope.reloadState();

    };

    angular.element(document).ready(function () {
        $('[data-click="change-bg"]').click(function(e) {
            e.preventDefault();
            var targetImage = '[data-id="login-cover-image"]';
            var targetImageSrc = $(this).find('img').attr('src');
            var targetImageHtml = '<img src="'+ targetImageSrc +'" data-id="login-cover-image" />';
        
            $('.login-cover-image').prepend(targetImageHtml);
            $(targetImage).not('[src="'+ targetImageSrc +'"]').fadeOut('slow', function() {
                $(this).remove();
            });
            $('[data-click="change-bg"]').closest('li').removeClass('active');
            $(this).closest('li').addClass('active');   
        });
    });
});
