/**
 * Renders the UI that starts the Excel import process
 *
 * The user is prompted to download the template, fill it out, then upload the filled-out template.
 *
 * You probably don't want to use this class directly. Instead, use Zan.data.excelImport.ExcelImporter
 */
Ext.define('Zan.data.excelImport.ChooseFilePopup', {
    extend: 'Ext.panel.Panel',

    config: {
        /**
         * @cfg {string} Path to the class representing the import in classpath dot notation
         *
         * For example: Modules.MyBundle.ExcelImport.SomeExcelTemplate
         */
        excelTemplate: null,

        /**
         * @cfg {string} HTML to display in the Excel Import popup
         *
         * NOTE: No escaping is done on this field!
         */
        userMessageHtml: null,
    },

    referenceHolder: true,

    // This is a modal popup that autoshows and can be moved/resized
    floating: true,
    closable: true,
    resizable: true,
    draggable: true,
    modal: true,
    autoShow: true,

    width: 400,

    title: 'Import From Excel',

    bodyPadding: 8,
    defaults: {
        labelWidth: 250,
    },
    items: [
        {
            xtype: 'panel',
            reference: 'userMessage',
            hidden: true, // shown in beforeRender if there's a userMessage
            margin: '0 0 8 0',
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Step 1: Download the template',
            items: [
                {
                    xtype: 'button',
                    reference: 'downloadTemplateButton',
                    text: 'Download Template',
                }
            ]
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Step 2: Fill out the template',
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Step 3: Upload the filled-out template',
            items: [
                {
                    xclass: 'Zan.common.view.FileUploadButton',
                    reference: 'fileUploadButton',
                    // Do not automatically submit since we need to send the file to two different endpoints
                    // See below event handler for fileSelected
                    submitOnChange: false,
                },
            ]
        },
    ],

    initComponent: function() {
        this.callParent(arguments);

        // Link download template to the correct location
        this.lookup('downloadTemplateButton').setHref('/api/zan/drest/excel-import/' + encodeURIComponent(this.getExcelTemplate()));

        // Re-fire the "file selected" event
        this.lookup('fileUploadButton').on('fileSelected', function(fileButton, formData, fileDomEl, arrayBufferContent) {
            this.fireEvent('fileSelected', fileButton, formData, fileDomEl, arrayBufferContent);
        }, this);

        if (this.getUserMessageHtml()) {
            var noticeHtml = `
                <div style="background: #FFFFE0; border: 1px solid #ffae00; padding: 4px; display: flex;">                    
                    <div style="">${this.getUserMessageHtml()}</div>
                </div>
            `;

            this.lookupReference('userMessage').setHtml(noticeHtml);
            this.lookupReference('userMessage').show();
        }
    },
});