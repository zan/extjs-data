Ext.define('Zan.data.button.SaveButtonController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Zan.data.util.ModelUtil',
        'Zan.data.util.StoreUtil',
    ],

    constructor: function(config) {
        this.callParent([config]);

        this._trackedItems = new Ext.util.MixedCollection();

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
        this._trackedItems.each(function(item) {
            this.untrackItem(item);
        }, this);
    },

    trackItem: function(modelOrStore) {
        // Early exit if we're already tracking it
        if (this._trackedItems.contains(modelOrStore)) return;

        if (modelOrStore instanceof Ext.data.Model) {
            // Note: records do not support on dirty events, instead they must be polled
            // See _initDirtyRecordPoller
        }
        if (modelOrStore instanceof Ext.data.Store) {
            // NOTE: cannot be an anonymous function because we need to remove it in clearTrackedItems
            modelOrStore.on('datachanged', this._onStoreDataChanged, this);
        }

        // todo: check if already tracked
        this._trackedItems.add(modelOrStore);
    },

    untrackItem: function(modelOrStore) {
        if (modelOrStore instanceof Ext.data.Store) {
            // Remove datachanged listener
            modelOrStore.un('datachanged', this._onStoreDataChanged, this);
        }

        this._trackedItems.remove(modelOrStore);
    },

    commitChanges: async function() {
        // todo: better error checking

        this._trackedItems.each(async function(recordOrStore) {
            if (recordOrStore instanceof Ext.data.Store) {
                // Wait until the store has synced and then clear the dirty flag
                // Note that this requires a 'delay' because datachanged seems to be fire multiple times
                // and it's not possible to ensure this is called last
                recordOrStore.on('datachanged', function() {
                    this._clearDirty();
                }, this, { single: true, delay: 50 });
                await Zan.data.util.StoreUtil.sync(recordOrStore);
            }
            if (recordOrStore instanceof Ext.data.Model && recordOrStore.isDirty()) {
                await Zan.data.util.ModelUtil.save(recordOrStore);
            }
        }, this);

        this._clearDirty();
    },

    _initDirtyRecordPoller: function() {
        this._dirtyRecordPoller.start({
            run: function() {
                this._trackedItems.each(function(item) {
                    // Ignore if it's a store since they can be tracked via listeners
                    if (item instanceof Ext.data.Store) return true;

                    if (item.isDirty()) this._markAsDirty();
                }, this);
            },
            scope: this,
            interval: 500,
        });
    },

    _onStoreDataChanged: function(store) {
        this.getViewModel().set('isDirty', true);
    },

    _markAsDirty: function() {
        this.getViewModel().set('isDirty', true);
    },

    _clearDirty: function() {
        this.getViewModel().set('isDirty', false);
    },
});