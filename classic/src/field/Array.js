Ext.define('Zan.data.field.Array', {
    extend: 'Ext.data.field.Array',

    alias: 'data.field.zan-array',

    // CONFIG NOTE: As a performance optimization, Ext does not use the typical "config"
    //  property in the base Ext.data.field.Field class. Additional properties must be
    //  manually managed in the constructor

    mixins: {
        // adds 'isLabelable', 'label', and getLabel() to this field
        zanLabelableField: 'Zan.data.model.LabelableFieldMixin'
    },

    allowNull: true,

    getType: function() {
        return 'zan-array';
    },
});