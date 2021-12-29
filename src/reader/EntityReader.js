Ext.define('Zan.data.reader.EntityReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.zan-entity',

    rootProperty: 'data',

    /**
     * OVERRIDDEN to apply metadata to records
     * @protected
     */
    getResponseData(response) {
        var rawData = this.callParent([response]);

        // Convert response-level entity editability data to _isEditable flag on each record
        if (rawData && rawData.metadata && rawData.metadata.editability) {
            Ext.Array.forEach(rawData.data, function(rawRecord) {
                rawRecord._isEditable = this._calculateRecordEditability(rawRecord, rawData.metadata.editability);
            }, this);
        }

        // Store field editability data on the model
        if (rawData && rawData.metadata && rawData.metadata.fieldEditability) {
            console.log("parsing field stuffs: %o", rawData.metadata.fieldEditability);
            if (Ext.isArray(rawData.data)) {
                // todo: response that's an array of records with multiple editability information
            }
            else {
                // For example:
                //rawData.data._editableFields = { requestedBy: true };
                rawData.data._editableFields = this._calculateFieldEditability(rawData.data, rawData.metadata.fieldEditability);
            }
        }

        return rawData;
    },

    _calculateRecordEditability: function(raw, editability) {
        var defaultEditability = editability.default;

        // If there's no 'exceptions' property then all records have the default value
        if (!editability.exceptions) return defaultEditability;

        // Look it up in the exceptions array
        // todo: should consult idProperty
        if (Ext.Array.contains(editability.exceptions, raw.id)) return !defaultEditability;

        // Not in exceptions array so it has default editability
        return defaultEditability;
    },

    /**
     * Returns an object where the keys are fields and the values are whether or not the property is editable
     *
     * If a property is missing from the object it should be considered read only
     */
    _calculateFieldEditability: function(rawRecord, editability) {
        var defaultEditability = editability.default;
        var editableFields = {};

        var fieldNames = Ext.Object.getKeys(rawRecord);

        Ext.Array.forEach(fieldNames, function(fieldName) {
            var isEditable = defaultEditability;
            if (editability.exceptions && Ext.Array.contains(editability.exceptions, fieldName)) {
                isEditable = !isEditable;
            }

            editableFields[fieldName] = isEditable;
        });

        return editableFields;
    }
});