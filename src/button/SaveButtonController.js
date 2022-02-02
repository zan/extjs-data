Ext.define('Zan.data.button.SaveButtonController', {
    extend: 'Ext.app.ViewController',

    init: function() {
        // todo: docs
        this._trackedRecords = [];
        this._dirtyRecords = [];
    },

    afterRender: function() {
        // Models don't support events, so we need to poll them to see if they are dirty
        this._runner = new Ext.util.TaskRunner();
        this._runner.start({
            run: function() {
                for (var i=0; i < this._trackedRecords.length; i++) {
                    var record = this._trackedRecords[i];

                    // todo: move isAnyAssociationDirty out of the model (for performance reasons) and see if we can do everything here
                    if (record.isDirty() || record.isAnyAssociationDirty()) {
                        this.markAsDirty();
                        this._addDirtyRecord(record);
                    }
                }
            },
            scope: this,
            interval: 500,
        });
    },

    destroy: function() {
        // Clean up task runner that polls for changes
        this._runner.destroy();

        this.callParent(arguments);
    },

    updateTrackedRecord: function(primaryRecord) {
        var view = this.getView();
        this._trackDirtyAssociations = view.getTrackDirtyAssociations();

        // Ensure record is tracking these associations
        if (this._trackDirtyAssociations.length > 0) {
            primaryRecord.trackDirtyAssociations(this._trackDirtyAssociations);
        }

        this._trackedRecords = [];
        // Always track the original record's dirty state
        if (primaryRecord) {
            this._trackedRecords.push(primaryRecord);

            // Process additional fields to see how to trakc them
            Ext.Array.forEach(this._trackDirtyAssociations, function(subFieldName) {
                var field = primaryRecord.zanGet(subFieldName);
                if (field instanceof Ext.data.Model) {
                    this._trackedRecords.push(field);
                }
                if (field instanceof Ext.data.Store) {
                    field.on('datachanged', function() {
                        this.getViewModel().set('isDirty', true);
                    }, this);
                }
            }, this);
        }
    },

    commitChanges: async function() {
        // todo: more features around firing events when saving starts and finishes to UIs can properly mask themselves
        // todo: this should save items serially

        if (this.getStore()) {
            throw new Error("todo: implement store saving including promisedSync");
        }

        // Commit any models with changes
        for (var i=0; i < this._dirtyRecords.length; i++) {
            var dirtyRecord = this._dirtyRecords[i];
            await dirtyRecord.promisedSave();
        }

        this._dirtyRecords = [];
        this.clearDirty();

        var successHandler = this.getView().getSuccessHandler();
        if (successHandler) {
            successHandler.call(this.getView().getScope(), this.getView());
        }
    },

    markAsDirty: function() {
        this.getViewModel().set('isDirty', true);
    },

    clearDirty: function() {
        this.getViewModel().set('isDirty', false);
    },

    _addDirtyRecord: function(newRecord) {
        // Ensure it's not already added
        for (var i=0; i < this._dirtyRecords.length; i++) {
            var curr = this._dirtyRecords[i];
            // todo: should be a library method for this
            // Record is already known
            if (curr.getId() === newRecord.getId() && curr.$className === newRecord.$className) return;
        }

        this._dirtyRecords.push(newRecord);
    },
});