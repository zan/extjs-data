/**
 * Renders a UI that shows problems with the uploaded Excel file
 */
Ext.define('Zan.data.excelImportProblemViewPopup', {
    extend: 'Ext.panel.Panel',

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

    // This is a modal popup that autoshows and can be moved/resized
    floating: true,
    closable: true,
    resizable: true,
    draggable: true,
    modal: true,
    autoShow: true,

    height: '90%',
    width: '90%',

    layout: {
        type: 'vbox',
        align: 'stretch',
    },

    title: 'Problems Found in Excel File',

    dockedItems: [
        {
            dock: 'top',
            xtype: 'panel',
            html: `
                <div style="background: #FFFFE0; border: 1px solid #ffae00; padding: 4px; display: flex;">
                    <span class="x-fa fa-exclamation-triangle" style="color: #ffae00; margin-right: 6px;"></span>
                    <div style="">
                        <div style="">Please fix the following problems in the Excel file and upload it again</div>
                    </div>
                </div>
            `
        },
        {
            dock: 'bottom',
            xtype: 'panel',
            bodyPadding: 4,
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Close',
                    scale: 'medium',
                    handler: function(button) {
                        button.up('panel').up('panel').hide();
                    }
                }
            ]
        }
    ],

    initComponent: function() {
        this.callParent(arguments);

        this.add(Ext.create('Zan.data.excelImportProblemViewGrid', {
            reference: 'problemViewGrid',
            excelColumns: this.getExcelColumns(),
            rawExcelData: this.getRawExcelData(),
            rawProblems: this.getRawProblems(),
            flex: 1,
        }));

        this.add(Ext.create('Zan.data.excelImportProblemListGrid', {
            excelColumns: this.getExcelColumns(),
            rawProblems: this.getRawProblems(),
            flex: 1,
            listeners: {
                problemSelected: function(grid, rowIdx, colIdx) {
                    this._selectProblemCell(rowIdx, colIdx);
                },
                scope: this,
            }
        }));
    },

    _selectProblemCell: function(rowIdx, colIdx) {
        this.lookup('problemViewGrid').selectProblemCell(rowIdx, colIdx);
    },
});