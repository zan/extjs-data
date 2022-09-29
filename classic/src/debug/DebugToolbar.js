/**
 * todo: https://www.chromestatus.com/feature/5685965186138112
 */
Ext.define('Zan.data.debug.DebugToolbar', {
    extend: 'Ext.toolbar.Toolbar',

    inheritableStatics: {
        show: function() {
            var appState = Ext.getApplication().getMainView().lookupViewModel().get('zanAppState');
            appState.set('zanDebugBarShowing', true);
            appState.save();
        },

        hide: function() {
            var appState = Ext.getApplication().getMainView().lookupViewModel().get('zanAppState');
            appState.set('zanDebugBarShowing', false);
            appState.save();
        },
    },

    constructor: function(config) {
        var items = [];

        // ----------------------
        // Rocket menu

        // NOTE: this menu opens from the bottom, more commonly used things should be LAST in this array
        var rocketMenuItems = [];

        // Link to font awesome documentation
        if (Ext.getApplication() && Ext.getApplication().getFontAwesomeDocumentationUrl) {
            rocketMenuItems.push({ text: 'Icon List', iconCls: 'x-fab fa-font-awesome', href: Ext.getApplication().getFontAwesomeDocumentationUrl(), hrefTarget: '_blank' });
        }

        // API viewer
        rocketMenuItems.push({ text: 'API Viewer', iconCls: 'x-fab fa-symfony', href: '#/zan/data/api-viewer', hrefTarget: '_blank' });

        items.push({
            xtype: 'button',
            iconCls: 'x-fa fa-rocket',
            arrowVisible: false,
            menu: {
                // NOTE: this menu opens from the bottom, more commonly used things should be LAST in this array
                items: rocketMenuItems,
            }
        });
        // ----------------------

        // Currently visible page
        items.push({
            xtype: 'displayfield',
            bind: {
                // Zan.data.model.ZanAppStateModel
                value: '{zanAppState.activePageClassName}',
            }
        });

        // ---> Right aligned below here
        items.push('->');

        // API viewer
        items.push({
            xtype: 'button',
            iconCls: 'x-fa fa-exchange-alt',
            tooltip: 'API Requests',
            handler() {
                Ext.create('Zan.data.debug.DebugRequestLogPopup', { autoShow: true });
            }
        });

        // Button to close the toolbar
        items.push({
            xtype: 'button',
            iconCls: 'x-fa fa-times-circle',
            tooltip: 'Close Debug Bar',
            handler: function() {
                var appState = this.lookupViewModel().get('zanAppState');
                appState.set('zanDebugBarShowing', false);
                appState.set('zanDesignUiShowing', false);
                appState.save();
            }
        });

        config.items = items;

        this.callParent([ config ]);
    },
});