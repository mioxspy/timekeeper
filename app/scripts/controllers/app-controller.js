'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:AppControllerCtrl
 * @description
 * # AppControllerCtrl
 * Controller of the uiApp
 */
var app = angular.module('uiApp');

app.controller('AppControllerCtrl', ['$rootScope', '$scope','$cookies','$window', function($rootScope, $scope, $cookies, $window) {
    $scope.$on('$includeContentLoaded', function() {
        handleSlimScroll();
    });
    $scope.$on('$viewContentLoaded', function() {
    });
    $scope.$on('$stateChangeStart', function() {
        // reset layout setting
        $rootScope.setting.layout.pageSidebarMinified = false;
        $rootScope.setting.layout.pageFixedFooter = false;
        $rootScope.setting.layout.pageRightSidebar = false;
        $rootScope.setting.layout.pageTwoSidebar = false;
        $rootScope.setting.layout.pageTopMenu = false;
        $rootScope.setting.layout.pageBoxedLayout = false;
        $rootScope.setting.layout.pageWithoutSidebar = false;
        $rootScope.setting.layout.pageContentFullHeight = false;
        $rootScope.setting.layout.pageContentFullWidth = false;
        $rootScope.setting.layout.paceTop = false;
        $rootScope.setting.layout.pageLanguageBar = false;
        $rootScope.setting.layout.pageSidebarTransparent = false;
        $rootScope.setting.layout.pageWideSidebar = false;
        $rootScope.setting.layout.pageLightSidebar = false;
        $rootScope.setting.layout.pageFooter = false;
        $rootScope.setting.layout.pageMegaMenu = false;
        $rootScope.setting.layout.pageWithoutHeader = false;
        $rootScope.setting.layout.pageBgWhite = false;
        $rootScope.setting.layout.pageContentInverseMode = false;
        
        App.scrollTop();
        $('.pace .pace-progress').addClass('hide');
        $('.pace').removeClass('pace-inactive');
    });
    $scope.$on('$stateChangeSuccess', function() {
        Pace.restart();
        App.initPageLoad();
        App.initSidebarSelection();
        App.initSidebarMobileSelection();
        setTimeout(function() {
            App.initLocalStorage();
            App.initComponent();
        },0);
    });
    $scope.$on('$stateNotFound', function() {
        Pace.stop();
    });
    $scope.$on('$stateChangeError', function() {
        Pace.stop();
    });
}]);

app.controller('sidebarController', function($scope, $rootScope, $state, $cookies, $window) {
    if ($cookies.getObject('loginUser')) {
        $rootScope.showLogout  = true;
        $scope.user = JSON.parse($cookies.get('loginUser'));
        /*console.log($cookies.getObject('loginUser'))*/
    }else{
        $window.location.href = '/#/member/login/index';
    }
    $scope.profile = {
        employeeno: $scope.user.employeeId,
        firstName: $scope.user.firstname,
        lastName: $scope.user.lastname,
        username: $scope.user.username,
        role: "Viewer" 
    };

    App.initSidebar();
});

app.controller('headerController', function($scope, $rootScope, $state, $timeout) {
    //$scope.petsa = new Date();
    $scope.petsa = "Loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms

    var tick = function() {
        $scope.petsa = Date.now() // get the current time
        $timeout(tick, $scope.tickInterval); // reset the timer
    }
    // Start the timer
    $timeout(tick, $scope.tickInterval);

});

app.controller('topMenuController', function($scope, $rootScope, $state) {
    setTimeout(function() {
        App.initTopMenu();
    }, 0);
});

app.controller('pageLoaderController', function($scope, $rootScope, $state) {
    App.initPageLoad();
});

app.controller('themePanelController', function($scope, $rootScope, $state) {
    App.initThemePanel();
});

app.controller('pageWithFooterController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageFooter = true;
});

app.controller('pageWithoutSidebarController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageWithoutSidebar = true;
});

app.controller('pageWithRightSidebarController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageRightSidebar = true;
});

app.controller('pageWithMinifiedSidebarController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageSidebarMinified = true;
});

app.controller('pageWithTwoSidebarController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageTwoSidebar = true;
});

app.controller('pageFullHeightContentController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageContentFullHeight = true;
    $rootScope.setting.layout.pageContentFullWidth = true;
});

app.controller('pageWithWideSidebarController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageWideSidebar = true;
});

app.controller('pageWithLightSidebarController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageLightSidebar = true;
});

app.controller('pageWithMegaMenuController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageMegaMenu = true;
});

app.controller('pageWithTopMenuController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageTopMenu = true;
    $rootScope.setting.layout.pageWithoutSidebar = true;
});

app.controller('pageWithBoxedLayoutController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageBoxedLayout = true;
});

app.controller('pageWithMixedMenuController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageTopMenu = true;
});

app.controller('pageBoxedLayoutWithMixedMenuController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageBoxedLayout = true;
    $rootScope.setting.layout.pageTopMenu = true;
});

app.controller('pageWithTransparentSidebarController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageSidebarTransparent = true;
});

app.controller('errorController', function($scope, $rootScope, $state) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
});

