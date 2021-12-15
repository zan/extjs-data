Ext.define('Zan.data.button.SaveButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.zan-savebutton',

    config: {
        store: null,
    },

    viewModel: {
        data: {
            isDirty: false,
        }
    },

    text: 'Save',
    iconCls: 'x-fa fa-save',

    bind: {
        //iconCls: '{isDirty ? "x-fas fa-save" : "x-far fa-save"}',
        disabled: '{!isDirty}',
    },

    handler: function() {
        // todo: fancy spinner
        // todo: disable button before save starts to prevent double click
        if (this.getStore()) {
            this.getStore().sync();
        }
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

    _onStoreDataChanged: function(store) {
        this.getViewModel().set('isDirty', true);
    },
});