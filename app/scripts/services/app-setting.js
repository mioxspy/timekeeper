'use strict';

/**
 * @ngdoc service
 * @name uiApp.appSetting
 * @description
 * # appSetting
 * Factory in the uiApp.
 */
angular.module('uiApp').factory('setting', function() {
    var setting = {
        layout: {
            pageSidebarMinified: false,
            pageFixedFooter: false,
            pageRightSidebar: false,
            pageTwoSidebar: false,
            pageTopMenu: false,
            pageBoxedLayout: false,
            pageWithoutSidebar: false,
            pageContentFullHeight: false,
            pageContentFullWidth: false,
            pageContentInverseMode: false,
            pageSidebarTransparent: false,
            pageWithFooter: false,
            pageLightSidebar: false,
            pageMegaMenu: false,
            pageBgWhite: false,
            pageWithoutHeader: false,
            paceTop: false
        }
    };
    
    return setting;
});