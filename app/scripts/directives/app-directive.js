'use strict';

/**
 * @ngdoc directive
 * @name uiApp.directive:appDirective
 * @description
 * # appDirective
 */
angular.module('uiApp').directive('appDirective', function () {
    return {
      	template: '<div></div>',
      	restrict: 'E',
      	link: function postLink(scope, element) {
        	element.text('this is the appDirective directive');
      	}
    };
});

angular.module('uiApp').directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault();
                });
            }
        }
    };
});

angular.module('uiApp')   
.directive('permission', function(AuthService) {
   return {
       restrict: 'A',
       scope: {
          permission: '='
       },
 
       link: function (scope, elem, attrs) {
            scope.$watch(AuthService.isLoggedIn, function() {
                if (AuthService.userHasPermission(scope.permission)) {
                    elem.show();
                } else {
                    elem.hide();
                }
            });                
       }
   }
});