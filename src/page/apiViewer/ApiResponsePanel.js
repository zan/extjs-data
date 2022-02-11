/**
 * Renders response data from an API call
 */
Ext.define('Zan.data.page.apiViewer.ApiResponsePanel', {
    extend: 'Ext.panel.Panel',

    viewModel: {},
   
    items: [
        {
            xtype: 'panel',
            itemId: 'htmlPanel',
            bind: {
                hidden: '{!responseInfo.requestSuccessful}',
            },
            autoScroll: true,
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
            var responseHtml = '<code style="margin: 4px;">' + Ext.util.Format.htmlEncode(JSON.stringify(responseInfo.responseData)) + '</code>';
            this.down('#htmlPanel').setHtml(responseHtml);
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