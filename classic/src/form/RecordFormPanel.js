Ext.define('Zan.data.form.RecordFormPanel', {
    extend: 'Ext.form.Panel',

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
});