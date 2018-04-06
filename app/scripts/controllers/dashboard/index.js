'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:DashboardIndexCtrl
 * @description
 * # DashboardIndexCtrl
 * Controller of the uiApp
 */
angular.module('uiApp').controller('DashboardIndexCtrl', 
    function ($scope, $rootScope, $state, $cookies, $mdToast) {
    /*$mdToast.show(
      $mdToast.simple()
        .textContent('Success!')
        .position('top right' )
        .highlightClass('amber')
        .hideDelay(99000)
    );*/
  


    

/*$mdToast.show({
              hideDelay   : 3000,
              position    : 'top right',
              template:
            '<md-toast>' +
              '<div class="md-toast-content error">' +
                'sss'+
              '</div>' +
            '</md-toast>'
        });*/

    angular.element(document).ready(function () {
        
        if ($cookies.getObject('loginUser')) {
            
        }else{
            $state.go('member.login.index'); 
        }        

    });
});


