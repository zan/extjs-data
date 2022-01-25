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

    getRecordData: function(record, operation) {
        var recordData = this.callParent(arguments);

        // Add in data from any dirty associations
        // todo: does this work for other kinds of associations?
        // todo: should rename getDirtyAssociations() to something like getDirtyStoreAssociations()?
        Ext.Array.forEach(record.getDirtyAssociations(), function(association) {
            var store = record[association.getterName]();
            recordData[association.role] = store.collect('id');
        });

        // todo: better way to handle this?
        //  currently used on AppUserRoleModel because 'role' association name conflicts with internal role so it
        //  needs to be renamed before persisting to the server
        if (Ext.isFunction(record.zanModifySaveData)) {
            record.zanModifySaveData(recordData);
        }

        return recordData;
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