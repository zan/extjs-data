Ext.define('Zan.data.field.Number', {
    extend: 'Ext.data.field.Number',

    alias: 'data.field.zan-number',

    // CONFIG NOTE: As a performance optimization, Ext does not use the typical "config"
    //  property in the base Ext.data.field.Field class. Additional properties must be
    //  manually managed in the constructor

    mixins: {
        // adds 'isLabelable', 'label', and getLabel() to this field
        zanLabelableField: 'Zan.data.model.LabelableFieldMixin'
    },

    allowNull: true,

    getType: function() {
        return 'zan-number';
    },
});