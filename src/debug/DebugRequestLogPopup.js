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
            viewConfig: {
                // Turn this off since we don't care if the RestRequestModel is dirty
                markDirty: false,
            },
            columns: [
                { text: 'Time', dataIndex: 'responseAt', xtype: 'datecolumn', format: 'h:i:sa' },
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