Ext.define('Zan.data.page.PageContainerView', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Zan.data.page.PageContainerViewController'
    ],

    config: {
        // todo: docs
        zanPageRoutes: null,
    },

    controller: { xclass: 'Zan.data.page.PageContainerViewController' },
    viewModel: {},

    layout: 'fit',

    updateZanPageRoutes: function(zanPageRoutes) {
        // If zanPageRoutes is specified declaratively the properties may actually be on the object's prototype
        if (Ext.Object.isEmpty(zanPageRoutes)) zanPageRoutes = Object.getPrototypeOf(zanPageRoutes);

        this.getController().setupRoutes(zanPageRoutes);
    }

});