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

        trackedItems: [],
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
        // Stop tracking previous store, if any
        if (this.getStore()) {
            this.getController().untrackItem(this.getStore());
        }

        return newStore;
    },

    updateStore: function(store) {
        this.getController().trackItem(store);
    },

    applyRecord: function(newRecord) {
        // Stop tracking previous store, if any
        if (this.getRecord()) {
            this.getController().untrackItem(this.getRecord());
        }

        return newRecord;
    },

    updateRecord: function(record) {
        this.getController().trackItem(record);
    },

    updateTrackedItems: function(items) {
        this.getController().clearTrackedItems();

        Ext.Array.forEach(items, function(item) {
            this.getController().trackItem(item);
        }, this);
    },
});