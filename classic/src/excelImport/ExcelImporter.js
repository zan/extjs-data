/**
 * Utility class for working with Excel imports
 *
 * Usage example:

        var importer = Ext.create('Zan.data.excelImport.ExcelImporter', {
            title: 'Import Specimens',
            excelTemplate: 'Modules.MyBundle.ExcelImport.SomeExcelTemplate',
            extraParams: {
                requestId: button.lookupViewModel().get('workRequest').getId(),
            },
            listeners: {
                importCommitted: function(importer, responseData) {
                    button.up('grid').refresh();
                },
            },
        });

        importer.startImport();

 *
 *  extraParams can be used when you need to pass additional data to the server
 *
 *  The importCommitted event is fired after the server has processed the import and created new entities
 *
 */
Ext.define('Zan.data.excelImport.ExcelImporter', {

    mixins: [
        'Ext.mixin.Observable'
    ],

    config: {
        /**
         * @cfg {string} Path to the class representing the import in classpath dot notation
         *
         * For example: Modules.MyBundle.ExcelImport.SomeExcelTemplate
         */
        excelTemplate: null,

        /**
         * @cfg {object} Additional values to send to the server when previewing and committing the import
         */
        extraParams: null,

        /**
         * @cfg {string} HTML to display in the Excel Import popup
         *
         * NOTE: No escaping is done on this field!
         */
        userMessageHtml: null,
    },

    constructor: function(config) {
        this._chooseFilePopup = null;

        this.initConfig(config);

        this.mixins.observable.constructor.call(this, config);
    },

    startImport: function() {
        this._chooseFilePopup = Ext.create('Zan.data.excelImport.ChooseFilePopup', {
            excelTemplate: this.getExcelTemplate(),
            userMessageHtml: this.getUserMessageHtml(),
            listeners: {
                fileSelected: function(fileButton, formData, fileDomEl, arrayBufferContent) {
                    // Add in any extraParams
                    Ext.Object.each(this.getExtraParams(), function(key, value) {
                        formData.append(key, value);
                    });

                    this._onFileSelected(fileButton, formData, fileDomEl);
                },
                scope: this,
            },
        });
    },

    /**
     * When the file is initially selected, send it to the preview endpoint
     */
    _onFileSelected: async function(fileButton, formData, fileDomEl) {
        var previewUrl = '/api/zan/drest/excel-import/' + encodeURIComponent(this.getExcelTemplate()) + '/preview';

        var response = await fetch(
            previewUrl,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            }
        );

        // Reset field value so that "change" event will fire if the same file is re-picked
        fileDomEl.value = null;

        if (!response.ok) {
            Ext.Msg.alert("Upload Error", "Error communicating with the server during file upload");
            return;
        }

        var jsonData = await response.json();

        // Show a detailed popup if there were problems with the upload
        if (jsonData.problems && jsonData.problems.length > 0) {
            Ext.create('Zan.data.excelImport.ProblemViewPopup', {
                excelColumns: jsonData.columns,
                rawExcelData: jsonData.rawExcelData,
                rawProblems: jsonData.problems,
            });

            return;
        }

        Ext.create('Zan.data.excelImport.ImportPreviewPopup', {
            excelColumns: jsonData.columns,
            importedData: jsonData.previewData,
            handler: function() {
                this._commitImport(formData);
            },
            scope: this
        });

        // Close the "import from excel" popup since we've succeeded and have a preview
        this._chooseFilePopup.hide();
    },

    _commitImport: async function(formData) {
        var importUrl = '/api/zan/drest/excel-import/' + encodeURIComponent(this.getExcelTemplate()) + '/import';

        var response = await fetch(
            importUrl,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            }
        );

        if (!response.ok) {
            Ext.Msg.alert("Import Error", "Error communicating with the server during import");
            return;
        }

        var decoded = await response.json();

        // Close the popup
        this._chooseFilePopup.hide();

        this.fireEvent('importCommitted', this, decoded);
    },
});