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

        // Convert response-level editability data to _isEditable flag on each record
        if (rawData && rawData.metadata && rawData.metadata.editability) {
            Ext.Array.forEach(rawData.data, function(rawRecord) {
                rawRecord._isEditable = this._calculateRecordEditability(rawRecord, rawData.metadata.editability);
            }, this);
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
});