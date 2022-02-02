/**
 * Utility methods for working with stores
 */
Ext.define('Zan.data.util.StoreUtil', {
    singleton: true,

    /**
     * Calls store.sync() and returns a promise
     *
     * @param {Ext.data.Store} store
     * @param {object} options
     * @returns {Promise<any>|Ext.promise}
     */
    sync: function(store, options) {
        options = options || {};
        var deferred = new Ext.Deferred();

        // Hook into the existing success handler if one was specified
        if (options.success) {
            Ext.Function.interceptAfter(options, 'success', function(record, operation) {
                deferred.resolve(record);
            });
        }
        // If there's no existing success handler, set our own
        else {
            options.success = function(record, operation) {
                deferred.resolve(record);
            };
        }

        // todo: reject on failure

        store.sync(options);

        return deferred.promise;
    },

    /**
     * Synchronizes the store's records to match the records in setRecords
     *
     * This method ensures that the store's remove() and add() methods are called so that store methods like
     * getRemovedRecords() work as expected
     */
    setRecords: function(store, setRecords) {
        var toAdd = [];
        var toRemove = [];

        Ext.Array.forEach(setRecords, function(setRecord) {
            // Nothing to do if the record already exists in the store
            // todo: support records with alternate ID fields
            if (store.findRecord('id', setRecord.getId())) return true;

            // Not found in store, it needs to be added
            toAdd.push(setRecord);
        });

        // Removed records will be ones in the store but not in the setRecords() array
        store.each(function(storeRecord) {
            var found = false;

            for (var i=0; i < setRecords.length; i++) {
                if (setRecords[i].getId() === storeRecord.getId()) {
                    found = true;
                    break;
                }
            }

            if (!found) toRemove.push(storeRecord);
        });

        store.remove(toRemove);
        store.add(toAdd);
    },
});