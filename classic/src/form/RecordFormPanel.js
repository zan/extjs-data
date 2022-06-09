/**
 * Form panel with model integration
 *

 ### Examples

    {
       xtype: 'zan-recordformpanel',
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
         * @cfg {Ext.data.Model} Record to associate with the form
         *
         * Setting this calls loadRecord()
         */
        formRecord: null,
    },

    // By default loadRecord() should be the last state of the form to reset() to
    trackResetOnLoad: true,

    updateFormRecord: function(record) {
        this.loadRecord(record);
    },
});