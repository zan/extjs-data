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
            //hidden: true,   // shown in loadResponseInfo
            bind: {
                hidden: '{responseInfo.requestSuccessful}',
            },
            autoScroll: true,
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
        this.getViewModel().set('responseInfo', responseInfo);

        if (responseInfo.requestSuccessful) {
            this.down('#jsonPanel').loadJson(responseInfo.responseData);
        }
        else {
            this.down("#errorPanel").setHtml(this._buildTroubleshootingHtml(responseInfo));
        }
    },

    _buildTroubleshootingHtml: function(responseInfo) {
        var html = [
            '<h2>Troubleshooting</h2>',
        ];

        if ('Zan.Drest.NoPermissionsOnEntity' === responseInfo.errorCode) {
            html.push([
                '<div style="margin: 4px; padding: 4px; border: 1px solid #c9c9c9;">',
                    'Check that the entity has an ApiPermissions annotation:',
                    '<p>',
                    '<code>@ApiPermissions(read="*", write={"App.editAllData", "ExampleProject.manageConfiguration"})</code>',
                '</div>',
            ].join("\n"));
        }

        return html.join("\n");
    },
});