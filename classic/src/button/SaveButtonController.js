Ext.define('Zan.data.button.SaveButtonController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Zan.data.util.ModelUtil',
        'Zan.data.util.StoreUtil',
    ],

    constructor: function(config) {
        this.callParent([config]);

        this._trackedItems = [];

        // Models don't support events, so we need to poll them to see if they are dirty
        this._dirtyRecordPoller = new Ext.util.TaskRunner();
    },

    afterRender: function() {
        this._initDirtyRecordPoller();
    },

    destroy: function() {
        // Clean up task runner that polls for changes
        this._dirtyRecordPoller.destroy();

        // Remove any store listeners
        this.clearTrackedItems();

        this.callParent(arguments);
    },

    clearTrackedItems: function() {
        while (this._trackedItems.length > 0) {
            this.untrackItem(this._trackedItems[0]);
        }
    },

    hasTrackedItem: function(item) {
        for (var i=0; i < this._trackedItems.length; i++) {
            if (item === this._trackedItems[i]) return true;
        }

        return false;
    },

    trackItem: function(item) {
        // Early exit if we're already tracking it
        if (this.hasTrackedItem(item)) return true;

        if (item instanceof Ext.data.Model) {
            // Note: records do not support on dirty events, instead they must be polled
            // See _initDirtyRecordPoller
        }
        if (item instanceof Ext.data.Store) {
            // NOTE: cannot be an anonymous function because we need to remove it in clearTrackedItems
            item.on('datachanged', this._onStoreDataChanged, this);
        }
        if (item instanceof Ext.form.Panel) {
            item.on('dirtychange', this._onFormDirtyChanged, this);
        }

        this._trackedItems.push(item);
    },

    untrackItem: function(modelOrStore) {
        if (modelOrStore instanceof Ext.data.Store) {
            // Remove datachanged listener
            modelOrStore.un('datachanged', this._onStoreDataChanged, this);
        }

        var itemIdx = this._trackedItems.indexOf(modelOrStore);
        if (itemIdx === -1) return; // Not in the array for some reason

        this._trackedItems.splice(itemIdx, 1)
    },

    commitChanges: async function() {
        // Track whether all data was saved successfully
        var successful = true;

        // First pass: validate any associated forms
        var allValid = true;
        Ext.Array.forEach(this._trackedItems, function(item) {
            // Skip anything that's not a form
            if (!(item instanceof Ext.form.Panel)) return true;

            if (!item.isValid()) allValid = false;
        });

        if (!allValid) return;

        for (var i=0; i < this._trackedItems.length; i++) {
            var item = this._trackedItems[i];

            try {
                if (item instanceof Ext.data.Store) {
                    // Wait until the store has synced and then clear the dirty flag
                    // Note that this requires a 'delay' because datachanged seems to be fire multiple times
                    // and it's not possible to ensure this is called last
                    item.on('datachanged', function() {
                        this._clearDirty();
                    }, this, { single: true, delay: 50 });

                    await Zan.data.util.StoreUtil.sync(item);
                }
                if (item instanceof Ext.data.Model && item.isDirty()) {
                    await Zan.data.util.ModelUtil.save(item);
                }
                if (item instanceof Ext.form.Panel && item.isDirty()) {
                    var form = item;
                    // Update the form's record with the most recent data
                    var formRecord = form.getRecord();
                    form.updateRecord(formRecord);

                    // Save the record
                    await Zan.data.util.ModelUtil.save(formRecord);

                    // Load the updated record back into the form
                    form.loadRecord(formRecord);
                }
            }
            catch (e) {
                if (e instanceof ZanDataApiError) {
                    successful = false;
                    Zan.data.Api.displayApiError(e);
                }
                else {
                    throw(e);
                }
            }
        }

        if (successful) {
            this._clearDirty();

            var successHandler = this.getView().getSuccessHandler();
            if (Ext.isFunction(successHandler)) {
                successHandler.call(this.getView().getScope(), this.getView());
            }

            var successToastMessage = this.getView().getSuccessToastMessage();
            if (successToastMessage) {
                Ext.toast(successToastMessage);
            }

            if (this.getView().getGoBackAfterSave()) {
                history.go(-1);
            }
        }
    },

    _initDirtyRecordPoller: function() {
        this._dirtyRecordPoller.start({
            run: function() {
                this._trackedItems.forEach(function(item) {
                    // Ignore items that can be tracked by listeners
                    if (item instanceof Ext.data.Store) return true;
                    if (item instanceof Ext.form.Panel) return true;

                    if (item.isDirty()) this._markAsDirty();
                }, this);
            },
            scope: this,
            interval: 100,
        });
    },

    _onStoreDataChanged: function(store) {
        this.getViewModel().set('isDirty', true);
    },

    _onFormDirtyChanged: function(form, isDirty, opts) {
        this.getViewModel().set('isDirty', isDirty);
    },

    _markAsDirty: function() {
        this.getViewModel().set('isDirty', true);
    },

    _clearDirty: function() {
        this.getViewModel().set('isDirty', false);
    },
});
