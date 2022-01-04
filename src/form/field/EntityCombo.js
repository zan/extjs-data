Ext.define('Zan.data.form.field.EntityCombo', {
    extend: 'Ext.form.field.ComboBox',

    displayField: 'label',
    valueField: 'id',

    // User must pick a valid record, if false users are able to enter string values
    forceSelection: true,

    queryMode: 'remote',
    pageSize: 100,
    minChars: 3,             // Number of characters required before remote query is performed

    // todo: necessary?
    autoLoadOnValue: true,

    // This must be false so that the paging controls get fully displayed
    // Without it, some of them will be cut off depending on the field's width
    matchFieldWidth: false,

    triggers: {
        clear: {
            cls: 'x-form-clear-trigger',
            handler: Ext.form.field.ComboBox.prototype.clearValue,
        }
    }
});