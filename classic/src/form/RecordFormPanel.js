/**
 * Form panel with model integration
 *
 * If this form is created with a reference it will register itself with the viewModel

 ### Examples

    {
       xtype: 'zan-recordformpanel',
       reference: 'myForm', // This will register the form with the viewModel
       bind: {
           formRecord: '{myRecord}',
       }
    },


 */
Ext.define('Zan.data.form.RecordFormPanel', {
    extend: 'Ext.form.Panel',

    alias: 'widget.zan-recordformpanel',

    requires: [
        'Zan.data.form.RecordFormMixin',
    ],

    mixins: {
        recordForm: 'Zan.data.form.RecordFormMixin',
    },

    config: {
        /**
         * @cfg {Ext.data.Model} Convenience setter for calling loadRecord() with this value
         */
        formRecord: null,
    },

    // By default loadRecord() should be the last state of the form to reset() to
    trackResetOnLoad: true,

    updateFormRecord: function(record) {
        this.loadRecord(record);
    },

    initComponent: function() {
        this.callParent(arguments);

        // If this component has a reference and a viewModel register it with that viewModel
        if (this.getReference() && this.lookupViewModel()) {
            this.lookupViewModel().set(this.getReference(), this);
        }
    },
});