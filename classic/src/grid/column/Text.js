Ext.define('Zan.data.grid.column.Text', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.zan-textcolumn',

    requires: [
        'Zan.common.String',
    ],

    config: {
        /**
         * @cfg {boolean} If true, escape HTML special characters
         */
        htmlEncode: true,

        /**
         * @cfg {object} Additional options to pass to Zan.common.String.from()
         */
        stringConversionOptions: null,
    },

    width: 200,


    filterType: 'string',

    /**
     * See: https://docs.sencha.com/extjs/7.3.1/classic/Ext.grid.column.Column.html#cfg-renderer
     */
    defaultRenderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var stringValue = this._getStringValue(value, record, this.dataIndex);

        if (this.getHtmlEncode()) {
            stringValue = Zan.common.String.htmlEncode(stringValue);
        }

        return stringValue;
    },

    /**
     * Sorts the two records by their string value. This follows the same rules
     * used to display the text value in the grid, so data will sort as the user
     * expects
     *
     * @param {Ext.data.Model} record1
     * @param {Ext.data.Model} record2
     * @returns {number}
     * @protected
     */
    _sorterFn: function(record1, record2) {
        var a = this._getStringValue(record1.get(this.getSortParam()), record1, this.getSortParam()).toUpperCase();
        var b = this._getStringValue(record2.get(this.getSortParam()), record2, this.getSortParam()).toUpperCase();

        // These hieroglyphics mean: return 1 if a > b, -1 if a < b, 0 if they're the same
        return (a > b) ? 1 : (a < b) ? -1 : 0;
    },

    _getStringValue: function(value, record, recordField) {
        if (this._isAssociationField(record, recordField)) {
            //if (debug) debugger;
            var reference = record.getField(recordField).reference;
            value = record[reference.getterName]();
            // Immediately check isLoading(), if true an async request has been triggered
            if (value && value.isLoading()) {
                // This is an exception because it probably means 1 API request per grid row (for each column to load)
                throw new Error("Grid lazy loading detected in field '" + this.dataIndex + "'. Ensure this field is returned from the API by using the responseFields configuration.");
            }
        }
        else if (this._isToManyAssociation(record, recordField)) {
            value = Zan.data.util.ModelUtil.getValue(record, recordField);
        }

        return Zan.common.String.from(value, this.getStringConversionOptions());
    },

    /**
     * Returns true if the field is a "has one" association defined in the fields section
     *
     * See also: _isToManyAssociation
     */
    _isAssociationField: function(record, recordField) {
        var field = record.getField(recordField);

        if (!field || Ext.isEmpty(field.reference)) return false;

        return true;
    },

    /**
     * Returns true if the field is a "to many" association
     */
    _isToManyAssociation: function(record, recordField) {
        // Early exit if this shows up in the fields list since we know right away it's not a "to many"
        var field = record.getField(recordField);
        if (field) return false;

        // Can't find a public way to check this, so call getAssociatedData() and see if it's present as a key
        // Return true if recordField appears as a key in the associated data array
        var keys = Ext.Object.getKeys(record.getAssociatedData());

        return Ext.Array.contains(keys, recordField);
    },
});