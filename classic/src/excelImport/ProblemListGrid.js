/**
 * A grid that shows a text-based list of all problems with the Excel upload
 */
Ext.define('Zan.data.excelImport.ProblemListGrid', {
    extend: 'Ext.grid.Panel',

    config: {
        /**
         * @cfg object[] Array of objects describing the Excel columns
         * todo: docs
         */
        excelColumns: null,

        /**
         * @cfg object[] Array of objects describing the problems in the Excel file
         */
        rawProblems: null,
    },

    store: {
        fields: [
            { name: 'excelRowNumber', type: 'zan-int' },
            { name: 'columnId', type: 'zan-string' },
            { name: 'columnLabel', type: 'zan-string' },
            { name: 'message', type: 'zan-string' },
        ]
    },

    columns: [
        { text: 'Row', dataIndex: 'excelRowNumber', xtype: 'zan-numbercolumn', format: '0' },
        { text: 'Column', dataIndex: 'columnLabel', xtype: 'zan-textcolumn' },
        { text: 'Problem', dataIndex: 'message', xtype: 'zan-textcolumn', flex: 1, },
    ],

    title: 'Problem List',

    initComponent: function() {
        this.callParent(arguments);

        // Load data into the store
        var store = this.getStore();
        Ext.Array.forEach(this.getRawProblems(), function(raw) {
            var column = this._getColumnById(raw.columnId);

            store.add({
                excelRowNumber: raw.row,
                columnId: column.id,
                columnLabel: column.label,
                message: raw.message,
            });
        }, this);

        // Listen for row selection events to correlate problems between this grid and the visual view
        this.on('select', function(grid, record, rowIdx) {
            var column = this._getColumnById(record.get('columnId'));

            var problemRowIdx = record.get('excelRowNumber') - 2; // convert from Excel numbering to grid numbering
            var problemColIdx = this._getColumnIndex(column.id);

            this.fireEvent('problemSelected', this, problemRowIdx, problemColIdx);
        }, this);
    },

    _getColumnById: function(id) {
        var columns = this.getExcelColumns();

        for (var i=0; i < columns.length; i++) {
            if (columns[i].id === id) return columns[i];
        }

        return null;
    },

    /**
     * Returns the 0-based index of columnId within the array of columns
     */
    _getColumnIndex: function(columnId) {
        var columns = this.getExcelColumns();

        for (var i=0; i < columns.length; i++) {
            if (columns[i].id === columnId) return i;
        }

        return null;
    },
});