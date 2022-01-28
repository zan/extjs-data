Ext.define('Zan.data.form.RecordFormPanel', {
    extend: 'Ext.form.Panel',

    config: {
        formRecord: null,
    },

    viewModel: {
        xclass: 'Zan.data.ViewModel'
    },

    // todo: automatic way to do this?
    updateFormRecord: function(record) {
        this.getViewModel().set('formRecord', record);
    },
});