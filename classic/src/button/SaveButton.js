/**
 * Provides a button for saving models or stores
 *
 * The button will be disabled until any of the tracked items (records or stores) are considered dirty
 *
 *
 ### Track a single record

        {
            xtype: 'zan-savebutton',
            bind: {
                record: '{someRecord}'
            },
        },

 ### Track a record and a store

        {
            xtype: 'zan-savebutton',
            bind: {
                trackedItems: ['{order}', '{order.items}']
            },
        },

 */
Ext.define('Zan.data.button.SaveButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.zan-savebutton',

    requires: [
        'Ext.window.Toast',
        'Zan.data.button.SaveButtonController',
    ],

    config: {
        /**
         * @cfg {Ext.data.Model} A model to track on the save button
         *
         * See also trackedItems for handling multiple records
         */
        record: null,

        /**
         * @cfg {Ext.data.Store} A store to track changes on
         *
         * See also trackedItems for handling multiple stores
         */
        store: null,

        /**
         * @cfg {Ext.form.Panel} A form panel to track changes on
         *
         * See also trackedItems for handling multiple forms
         */
        form: null,

        /**
         * @cfg {string} Toast message to display when save completes
         *
         * Pass null or an empty string to avoid displaying a tost message
         */
        successToastMessage: 'Data Saved',

        /**
         * @cfg {boolean} If true, the browser will go back one page after a successful save
         */
        goBackAfterSave: false,

        /**
         * @cfg {function} Called when all saves have completed
         *
         * Arguments:
         *  - saveButton
         */
        successHandler: null,

        /**
         * @cfg {mixed} The scope for successHandler and other functions
         */
        scope: null,

        /**
         * @cfg {mixed} An array of stores and models to track changes on
         *
         * Clicking the save button will save all dirty items in this array
         */
        trackedItems: [],

        /**
         * @cfg {function} If set, this will be called instead of the default saving logic
         *
         * If you override this, you also need to manually call _clearDirty when saving is complete
         */
        saveHandler: null,
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
        var manualSaveHandler = this.getSaveHandler();

        // Allow overriding save logic
        if (Ext.isFunction(manualSaveHandler)) {
            manualSaveHandler.call(this.getScope() || this, this);
        }
        // Default save handler
        else {
            this.getController().commitChanges();
        }
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

    updateForm: function(form) {
        this.getController().trackItem(form);
    },

    updateTrackedItems: function(items) {
        this.getController().clearTrackedItems();

        Ext.Array.forEach(items, function(item) {
            this.getController().trackItem(item);
        }, this);
    },
});
