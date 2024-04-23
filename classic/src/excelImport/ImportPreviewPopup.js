/**
 * Popup that displays which records will be created
 */
Ext.define('Zan.data.excelImport.ImportPreviewPopup', {
    extend: 'Zan.common.view.PopupDialogPanel',

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

    height: '90%',
    width: '90%',

    layout: {
        type: 'vbox',
        align: 'stretch',
    },

    title: 'Import Preview',

    initComponent: function() {
        this.callParent(arguments);

        this.add(Ext.create('Zan.data.excelImport.ImportPreviewGrid', {
            excelColumns: this.getExcelColumns(),
            importedData: this.getImportedData(),
            flex: 1,
        }));
    },
});