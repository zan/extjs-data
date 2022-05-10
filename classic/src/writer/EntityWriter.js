/**
 * Ensures relationships are written correctly to the remote API
 */
Ext.define('Zan.data.writer.EntityWriter', {
    extend: 'Ext.data.writer.Json',
    alias: 'writer.zan-entity',

    // This means that when creating new records only send changes
    // By default, all fields are sent, which means a lot of extra defaulting and "empty" cases
    // that need to be handled
    // See: https://docs.sencha.com/extjs/7.5.0/classic/Ext.data.writer.Json.html#cfg-allDataOptions
    allDataOptions: {
        changes: true,
    },

    /**
     * OVERRIDDEN for improved record handling, see _processRawRecord
     */
    writeRecords: function(request, rawRecords) {
        for (var i=0; i < rawRecords.length; i++) {
            rawRecords[i] = this._processRawRecord(rawRecords[i]);
        }

        return this.callParent(arguments);
    },

    /**
     * Recursively ensures all data in "raw" is something that can be json-encoded
     *
     * This fixes an issue where calling save() on a record with a manyToMany association includes model classes
     * in the raw data and generates a json error like "Uncaught TypeError: Converting circular structure to JSON"
     *
     * If this method encounters a model:
     *
     *      - If the record has an ID, it's assumed to be an association and only the ID is included
     *      - If there's no ID, all record data is passed
     */
    _processRawRecord: function(raw) {
        Ext.Object.each(raw, function(key, value, obj) {
            // Convert models into something that can be serialized
            if (value instanceof Ext.data.Model) {
                obj[key] = this._encodeModel(value);
            }

            // Recurse into arrays
            if (Ext.isArray(value)) {
                for (var i=0; i < value.length; i++) {
                    value[i] = this._encodeValue(value[i]);
                }
            }
        }, this);

        return raw;
    },

    getRecordData: function(record, operation) {
        var recordData = this.callParent(arguments);

        // Look for additional dirty associations that aren't picked up by Ext
        Ext.Array.forEach(record.getDirtyAssociations(), function (association) {
            var assocValue = record[association.getterName]();

            if (assocValue instanceof Ext.data.Store) {
                recordData[association.role] = assocValue.getRange();
            }
        });


        // todo: dubious experiments below here

        // todo: writefields triggers additional http GET (??) requests on save when this is enabled
        //  to reproduce, on the user edit page, add write fields userDepartmentMappings, userDepartmentMappings.user, userDepartmentMappings.department
        var writeFields = record.getWriteFields();

        Ext.Array.forEach(writeFields, function(item) {
            this._resolveFieldValueAndStore(record, item, recordData);
        }, this);

        // todo: is this feature actually necessary? was originally added to work around 'role' name conflict, but that
        //  was resolved by renaming the associationRole to 'permissionsRole'
        if (Ext.isFunction(record.zanModifySaveData)) {
            record.zanModifySaveData(recordData);
        }

        return recordData;
    },

    /**
     *
     */
    _resolveFieldValueAndStore: function(record, fieldPath, destination) {
        // If there's a dot in it, we need to recurse
        if (fieldPath.includes('.')) {
            var parsed = fieldPath.split('.');
            var parentPath = parsed[0];
            var parent = Zan.data.util.ModelUtil.getValue(record, parentPath);  // first element of the array is used to look up the new 'record'
            var childPath = parsed.slice(1).join('.');     // remaining array elements are used to recurse into the record

            this._resolveFieldValueAndStore(parent, childPath, destination[parentPath]);
            return;
        }

        // Special case: record is a store, we need to iterate over every item in the store and append to 'destination'
        if (record instanceof Ext.data.Store) {
            var storeRecords = record.getRange();
            // Destination will have already been created as an array by a previous pass of this method
            for (var i=0; i < destination.length; i++) {
                this._resolveFieldValueAndStore(storeRecords[i], fieldPath, destination[i]);
            }
        }
        // Typical case: record is a single record
        if (record instanceof Ext.data.Model) {
            var value = Zan.data.util.ModelUtil.getValue(record, fieldPath);
            // If the "value" is a store, write an array of record IDs
            if (value instanceof Ext.data.Store) {
                var store = value;
                // Write store records to an array
                if (Ext.isEmpty(destination[fieldPath])) destination[fieldPath] = [];
                // Write record IDs
                store.each(function(record) {
                    var recordData = record.getData({ critical: true, changes: true });

                    // Phantom records have auto-generated Ext IDs which shouldn't get use (server will generate a new one)
                    if (record.isPhantom()) {
                        delete recordData.id;
                    }

                    destination[fieldPath].push(recordData);
                });
            }
            // For a record, use the ID
            if (value instanceof Ext.data.Model) {
                destination[fieldPath] = value.getId();
            }
        }
    },

    _encodeValue: function(value) {
        if (value instanceof Ext.data.Model) {
            return this._encodeModel(value);
        }

        return value;
    },

    _encodeModel: function(model) {
        if (model.phantom) {
            throw new Error("figure out how to encode model correctly here");
            //return model.data
        }
        else {
            return model.getId();
        }
    }
});