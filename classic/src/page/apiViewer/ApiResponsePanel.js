/**
 * Renders response data from an API call
 */
Ext.define('Zan.data.page.apiViewer.ApiResponsePanel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Zan.data.panel.JsonViewPanel',
    ],

    viewModel: {},
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
   
    items: [
        {
            xtype: 'panel',
            flex: 1,
            layout: { type: 'vbox', align: 'stretch' },
            bind: {
                hidden: '{!responseInfo.requestSuccessful}',
            },
            tbar: [
                {
                    iconCls: 'x-fa fa-compress-alt',
                    handler: function(button) {
                        button.up('panel').down('#jsonPanel').showLess();
                    }
                },
                {
                    iconCls: 'x-fa fa-expand-alt',
                    handler: function(button) {
                        button.up('panel').down('#jsonPanel').showMore();
                    }
                },
            ],
            items: [
                {
                    xclass: 'Zan.data.panel.JsonViewPanel',
                    itemId: 'jsonPanel',
                    flex: 1,
                },
            ]
        },
        {
            xtype: 'panel',
            itemId: 'errorPanel',
            flex: 1,
            hidden: true,   // shown in loadResponseInfo
            bind: {
                hidden: '{responseInfo.requestSuccessful}',
            },
            scrollable: true,
            tbar: [
                {
                    xtype: 'displayfield',
                    bind: {
                        value: '<span class="x-fas fa-exclamation-circle" style="color: red;"></span> {responseInfo.errorMessage}',
                    }
                },
            ],
        }
    ],

    loadResponseInfo: function(responseInfo) {
        if (responseInfo.requestSuccessful) {
            // Verify that the json can be decoded since this may be a successful HTTP request containing an error
            try {
                if (!Ext.isObject(responseInfo.responseData)) {
                    // throws an exception if json is invalid
                    JSON.parse(responseInfo.responseData);
                }
                this.down('#jsonPanel').loadJson(responseInfo.responseData);
            }
            // Actually an error
            catch (ex) {
                console.error(ex);
                responseInfo.requestSuccessful = false;
                this.down("#errorPanel").setHtml(responseInfo.responseData);
                this.down("#errorPanel").show();
            }
        }
        else {
            this.down("#errorPanel").setHtml(this._buildTroubleshootingHtml(responseInfo));
        }

        this.getViewModel().set('responseInfo', responseInfo);
    },

    _buildTroubleshootingHtml: function(responseInfo) {
        var headerHtml = [
            '<h2>Troubleshooting</h2>',
        ];

        var troubleshootingHtml = Zan.data.developerTroubleshooting
            .DeveloperTroubleshootingRegistry
            .buildSuggestions(
                'API_REQUEST',
                {
                    responseInfo: responseInfo,
                }
            );

        return headerHtml.join("\n") + troubleshootingHtml;
    },
});