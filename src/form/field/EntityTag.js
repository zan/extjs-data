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

    // Without this minWidth the paging controls are cut off when there aren't any results
    // in the picker or when the field is too small
    minWidth: 375,

    triggers: {
        clear: {
            cls: 'x-form-clear-trigger',
            handler: Ext.form.field.ComboBox.prototype.clearValue,
        }
    }
});