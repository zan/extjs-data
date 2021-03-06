/**
 * Provides a button for saving models, forms, or stores
 *
 * The button will be disabled until any of the tracked items (records, forms, or stores) are considered dirty
 *
 *
 ### Track a form

        {
            xtype: 'zan-savebutton',
            bind: {
                form: '{someForm}' // Also: FIRST_PARENT_FORM (see below)
            },
        },

 Also supported is binding the form to 'FIRST_PARENT_FORM'. In that case, it will bind to the first component found via this.up('form')

 For example:

        {
            xtype: 'zan-savebutton',
            bind: {
                form: 'FIRST_PARENT_FORM',
            },
        },

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
         * @cfg {mixed[]} An array of stores and models to track changes on
         *
         * Clicking the save button will save all dirty items in this array
         */
        trackedItems: null,

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
        if ('FIRST_PARENT_FORM' === form) {
            form = this.up('form');
        }

        if (!(form instanceof Ext.form.Panel)) {
            throw new Error("SaveButton must be bound to an Ext.form.Panel");
        }
        this.getController().trackItem(form);
    },

    updateTrackedItems: function(items) {
        this.getController().clearTrackedItems();

        Ext.Array.forEach(items, function(item) {
            this.getController().trackItem(item);
        }, this);
    },
});
