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
         * @cfg {string} Component to dock at the top of the page
         *
         * todo: topDockedItemClass would be more generic?
         */
        pageMenuClass: null,

        // todo: docs
        zanRouteParameters: null,
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

    initComponent: function() {
        this.callParent();

        this._applyRouteParametersToViewModel();
    },

    _applyRouteParametersToViewModel() {
        this.lookupViewModel().set('zanRouteParams', this.getZanRouteParameters());
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