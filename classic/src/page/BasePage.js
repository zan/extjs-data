/**
 * ### Loading models
 *
    viewModel: {
        links: {
            pageRecord: {
                type: 'App.model.ExampleModel',
                identifier: '{zanRouteParams.publicId}',
                params: {
                    includeMetadata: ['fieldEditability'],
                    responseFields: [
                        'createdBy',
                    ],
                },
            }
        }
    }
 */
Ext.define('Zan.data.page.BasePage', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Zan.data.ViewModel',
    ],

    alias: 'widget.zan-page',

    config: {
        /**
         * @cfg {boolean} If true, this page will not be automatically destroyed
         * when a new page is navigated to
         *
         * Note that there are no guarantees if/when the page will be cleaned up
         */
        delayCleanup: false,

        /**
         * @cfg {object} Route parameters as defined in the route definition
         *
         * This value is assigned when PageContainerViewController creates the page after processing the route
         */
        zanRouteParams: null,
    },

    viewModel: {
        xclass: 'Zan.data.ViewModel',
    },

    title: 'Loading...',

    // This preserves the page's layout if it's a delayedCleanup page
    // The routing system will hide the page until it should be shown again
    hideMode: 'offsets',

    layout: {
        type: 'vbox',
        align: 'stretch',
    },

    // Allow this to be a container that holds references to items even if there is no controller
    // https://docs.sencha.com/extjs/7.5.0/classic/Ext.panel.Panel.html#cfg-referenceHolder
    referenceHolder: true,

    updateZanRouteParams: function(value) {
        this.lookupViewModel().set('zanRouteParams', this.getZanRouteParams());
    },

    setTitle: function(value) {
        // Update browser title
        document.title = value;

        var encodedValue = Ext.htmlEncode(value);

        return this.callParent([encodedValue]);
    },

    getLoggedInUser: function() {
        return this.lookupViewModel().get('appLoggedInUser');
    },
});