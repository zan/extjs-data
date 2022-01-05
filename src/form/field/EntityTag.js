/**
 * todo: Lots of shared configuration with Zan.data.form.field.ComboBox, is there a way to use a mixin or some other
 *  way to share configuration?
 */
Ext.define('Zan.data.form.field.EntityTag', {
    extend: 'Ext.form.field.Tag',

    displayField: 'label',
    valueField: 'id',

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