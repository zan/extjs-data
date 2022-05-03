/**
 * Represents global application state. There is only ever one of these models and it is available
 * at the top level of the viewport.
 *
 * Some data is persisted to local storage, see the bottom of the file where this state is managed
 */
Ext.define('Zan.data.model.ZanAppStateModel', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.proxy.LocalStorage',
    ],

    fields: [
        { name: 'activePage', allowNull: true, persist: false, },
        { name: 'activePageClassName', type: 'string',
            calculate: function(data) {
                return Ext.getClassName(data.activePage);
            }
        },

        { name: 'zanDebugBarShowing', type: 'bool' },
        { name: 'zanDesignUiShowing', type: 'bool' },
    ],

    proxy: {
        type: 'localstorage',
        id: 'zan-app-state'
    },
});