/**
 * Grid displaying the data to be imported
 */
Ext.define('Zan.data.excelImport.ImportPreviewGrid', {
    extend: 'Ext.grid.Panel',

    config: {
        /**
         * @cfg object[] Array of objects describing the Excel columns
         *
         * See ExcelImportController::serializeColumns for the data contained in this array
         */
        excelColumns: null,

        /**
         * @cfg object[] Array of objects describing the data that will be imported
         */
        importedData: null,
    },

    constructor: function(config) {
        config.store = this._buildStore(config.excelColumns, config.importedData);

        // Build columns from the raw excel data
        config.columns = this._buildGridColumns(config.excelColumns);

        this.callParent([ config ]);
    },

    _buildStore: function(excelColumns, rawImportData) {
        return Ext.create('Ext.data.Store', {
            fields: excelColumns,
            data: rawImportData,
        });
    },

    _buildGridColumns: function(excelColumns) {
        var columns = [];

        // Start with a numberer
        columns.push({ xtype: 'rownumberer' });

        Ext.Array.forEach(excelColumns, function(rawColumn) {
            columns.push({
                xtype: 'stowers-textcolumn',
                text: rawColumn.label,
                dataIndex: rawColumn.id,
                sortable: false,
                scope: this,
            });
        }, this);

        // Add one final "empty" column that takes up remaining space so smaller imports look better
        columns.push({ flex: 1 });

        return columns;
    },
});