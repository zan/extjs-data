Ext.define('Zan.data.field.Integer', {
    extend: 'Ext.data.field.Integer',

    alias: 'data.field.zan-int',

    // CONFIG NOTE: As a performance optimization, Ext does not use the typical "config"
    //  property in the base Ext.data.field.Field class. Additional properties must be
    //  manually managed in the constructor

    mixins: {
        // adds 'isLabelable', 'label', and getLabel() to this field
        zanLabelableField: 'Zan.data.model.LabelableFieldMixin'
    },

    getType: function() {
        return 'zan-int';
    },
});