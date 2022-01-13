Ext.define('Zan.data.button.SaveButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.zan-savebutton',

    requires: [
        'Ext.window.Toast',
        'Zan.data.button.SaveButtonController',
    ],

    config: {
        record: null,
        store: null,

        successToastMessage: 'Data Saved',

        successHandler: null,
        scope: null,

        trackRecordFields: [],
    },

    controller: { xclass: 'Zan.data.button.SaveButtonController' },
    viewModel: {
        data: {
            isDirty: false,
        }
    },

    text: 'Save',
    iconCls: 'x-fa fa-save',

    // Enabled when there's data to save
    disabled: true,

    bind: {
        //iconCls: '{isDirty ? "x-fas fa-save" : "x-far fa-save"}',
        disabled: '{!isDirty}',
    },

    handler: function() {
        this.getController().commitChanges();
    },

    applyStore: function(newStore) {
        // Remove listener from previous store, if any
        if (this.getStore()) {
            this.getStore().un('datachanged', this._onStoreDataChanged, this);
        }

        return newStore;
    },

    updateStore: function(store) {
        // NOTE: cannot be an anonymous function because we need to remove it in applyStore
        store.on('datachanged', this._onStoreDataChanged, this);
    },

    updateRecord: function(record) {
        this.getController().updateTrackedRecord(record);
    },

    _onStoreDataChanged: function(store) {
        this.getViewModel().set('isDirty', true);
    },
});