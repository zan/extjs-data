Ext.define('Zan.data.debug.DebugRequestLogPopup', {
    extend: 'Zan.common.view.PopupDialogPanel',

    title: 'Request Log',

    showCancelButton: false,
    width: '80%',
    height: '80%',

    items: [
        {
            xtype: 'grid',
            store: 'Zan.data.DebugRequestLogStore',
            // Uses Zan.data.model.RestRequestModel
            viewConfig: {
                // Turn this off since we don't care if the RestRequestModel is dirty
                markDirty: false,
            },
            columns: [
                { text: 'Time', dataIndex: 'responseAt', xtype: 'datecolumn', format: 'h:i:sa' },
                {
                    xtype: 'actioncolumn',
                    width: 32,
                    align: 'center',
                    items: [
                        {
                            tooltip: 'Successful?',
                            getClass: function(value, meta, record, rowIndex, colIndex, store) {
                                return record.get('isError') ? 'x-fa fa-times' : 'x-fa fa-check-square';
                            }
                        },
                        {
                            tooltip: 'Debugging Link',
                            getClass: function(value, meta, record, rowIndex, colIndex, store) {
                                return record.get('remoteDebugLink') ? 'x-fa fa-symfony' : '';
                            },
                            handler: function (grid, rowIdx, colIdx, clickedItemOrColumn, evt, record, tableRow) {

                            },
                        }
                    ]
                },
                {
                    width: 36,
                    align: 'center',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        if (!record.get('remoteDebugLink')) return '';

                        var remoteDebugLinkEncoded = Ext.htmlEncode(record.get('remoteDebugLink'));

                        return `<a href="${remoteDebugLinkEncoded}" target="_blank"><span class="x-fa fa-bug"></span></a>`;
                    }
                },
                { text: 'Method', dataIndex: 'method' },
                { text: 'URL', dataIndex: 'url', flex: 1,
                    renderer(value, metaData, record, rowIndex, colIndex, store, view) {
                        var requestDebugLink = '#/zan/data/api-viewer?';
                        requestDebugLink += 'requestUrl=' + encodeURIComponent(record.get('url'));
                        requestDebugLink += '&requestMethod=' + encodeURIComponent(record.get('method'));
                        if ('GET' !== record.get('method')) {
                            requestDebugLink += '&requestData=' + encodeURIComponent(JSON.stringify(record.get('parameters')));
                        }

                        return `<a href="${requestDebugLink}" target="_blank">${value}</a>`;
                    }
                },
            ]
        },
    ],

});