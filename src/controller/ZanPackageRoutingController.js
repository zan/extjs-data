Ext.define('Zan.data.controller.ZanPackageRoutingController', {
    extend: 'Zan.ui.controller.BasePageRoutingController',

    requires: [
        'Zan.data.page.ApiViewerPage',
        'Zan.ui.RoutingHelper',
    ],

    init: function() {
        this.setRoutes(Zan.ui.RoutingHelper.linkToPages({
            '/zan/data/api-viewer':        'Zan.data.page.ApiViewerPage',
        }));
    }
});