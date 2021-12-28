Ext.define('Zan.data.store.DebugRequestLogStore', {
    extend: 'Ext.data.Store',
    singleton: true,

    requires: [
        'Zan.data.model.RestRequestModel'
    ],

    storeId: 'Zan.data.DebugRequestLogStore',

    model: 'Zan.data.model.RestRequestModel',
    sorters: [
        { property: 'responseAt', direction: 'DESC' },
    ]
});