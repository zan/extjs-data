Ext.define('Zan.data.button.SaveButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.zan-savebutton',

    requires: [
        'Ext.window.Toast',
    ],

    config: {
        record: null,
        store: null,

        successToastMessage: 'Data Saved',

        successHandler: null,
        scope: null,
    },

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

    afterRender: function() {
        this.callParent(arguments);

        // Models don't support events, so we need to poll them to see if they are dirty
        // todo: ViewModel docs seem to think you can, needs multiple bind properties?
        // https://docs.sencha.com/extjs/7.5.0/classic/Ext.app.ViewModel.html
        var runner = new Ext.util.TaskRunner();
        runner.start({
            run: function() {
                // Nothing to do unless there's a record
                if (!this.getRecord()) return;

                this.getViewModel().set('isDirty', this.getRecord().isDirty());
            },
            scope: this,
            interval: 500,
        });

        // Clean up all tasks and the runner when this component is destroyed
        this.on('destroy', function() {
            runner.destroy();
        });
    },

    handler: function() {
        // todo: fancy spinner
        // todo: disable button before save starts to prevent double click
        // todo: error handling
        if (this.getStore()) {
            this.getStore().sync();
        }
        if (this.getRecord()) {
            this.getRecord().save({
                success: function(record, operation) {
                    if (this.getSuccessToastMessage()) {
                        Ext.toast(this.getSuccessToastMessage());
                    }

                    if (this.getSuccessHandler()) {
                        this.getSuccessHandler().call(this.getScope(), this);
                    }
                },
                failure: function(record, operation) {
                    // todo: better handling
                    console.warn("Save failed!");
                },
                scope: this
            });
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