/**
 * Renders problems with an excel import
 */
Ext.define('Zan.data.excelImport.ProblemViewGrid', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.grid.selection.SpreadsheetModel',
    ],

    config: {
        /**
         * @cfg object[] Array of objects describing the Excel columns
         *
         * See ExcelImportController::serializeColumns for the data contained in this array
         */
        excelColumns: null,

        /**
         * @cfg object[] Array of objects representing the raw data as read from the Excel file
         */
        rawExcelData: null,

        /**
         * @cfg object[] Array of objects describing the problems in the Excel file
         */
        rawProblems: null,
    },

    referenceHolder: true,

    selModel: {
        type: 'spreadsheet',
    },

    constructor: function(config) {
        config.store = this._buildStore(config.excelColumns, config.rawExcelData);

        // Build columns from the raw excel data
        config.columns = this._buildGridColumns(config.excelColumns);

        this.callParent([ config ]);
    },

    initComponent: function() {
        this.callParent(arguments);

        // Hide the numberer column added by the selection model since it starts at 1 and is confusing
        // We add our own 2-based row numberer, see _buildGridColums
        this.getSelectionModel().getNumbererColumn().hide();
    },

    selectProblemCell: function(rowIdx, colIdx) {
        // Compensate for the numbering column
        colIdx++;

        this.getSelectionModel().selectCells([colIdx, rowIdx], [colIdx, rowIdx]);

        // Ensure the cell is visible
        this.ensureVisible(rowIdx, { column: colIdx });
    },

    _buildStore: function(excelColumns, rawExcelData) {
        return Ext.create('Ext.data.Store', {
            fields: excelColumns,
            data: rawExcelData,
        });
    },

    _buildGridColumns: function(excelColumns) {
        var columns = [
            // Number columns starting at 2 to account for the header row and to match how Excel numbers the rows
            {
                xtype: 'stowers-textcolumn',
                text: 'Row',
                width: 60,
                align: 'end',
                renderer: function(value, metaData, record, rowIdx, colIdx, dataSource, view) {
                    return rowIdx + 2;
                },
            },
        ];

        Ext.Array.forEach(excelColumns, function(rawColumn) {
            columns.push({
                xtype: 'stowers-textcolumn',
                text: rawColumn.label,
                dataIndex: rawColumn.id,
                sortable: false,
                renderer: function(value, metaData, record, rowIdx, colIdx, dataSource, view) {
                    var cellProblem = this._getCellProblemByIdx(rowIdx, colIdx);

                    if (cellProblem) {
                        metaData.tdStyle = "background-color: #FFCCCC";
                        metaData.tdAttr = 'data-qtip="' + Ext.htmlEncode(cellProblem.message) + '"';
                    }

                    return Ext.htmlEncode(value);
                },
                scope: this,
            });
        }, this);

        return columns;
    },

    _getCellProblemByIdx: function(rowIdx, colIdx) {
        var realColIdx = colIdx - 1; // To compensate for hidden rownumberer
        var excelRowNum = rowIdx + 2; // Because Excel rows are 1-based and we're skipping the header row

        var columnId = this._getColumnIdByIndex(realColIdx);

        var problems = this.getRawProblems();
        for (var i=0; i < problems.length; i++) {
            var problem = problems[i];
            if (problem.columnId === columnId && problem.row === excelRowNum) {
                return problem;
            }
        }

        return false;
    },

    _getColumnIdByIndex: function(colIdx) {
        var columns = this.getExcelColumns();

        for (var i=0; i < columns.length; i++) {
            // Note: this is i+1 because of the row numbering column. So, colIdx 1 is the first excel column
            if ((i+1) === colIdx) return columns[i].id;
        }

        return null;
    },
});