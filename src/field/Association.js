/**
 * Represents a field associated with another model
 *
 * todo: revisit after one to many
 */
Ext.define('Zan.data.field.Association', {
    extend: 'Ext.data.field.Field',

    alias: 'data.field.zan-association',

    // CONFIG NOTE: As a performance optimization, Ext does not use the typical "config"
    //  property in the base Ext.data.field.Field class. Additional properties must be
    //  manually managed in the constructor

    mixins: {
        // adds 'isLabelable', 'label', and getLabel() to this field
        zanLabelableField: 'Zan.data.model.LabelableFieldMixin'
    },

    isZanAssociation: true,

    getType: function() {
        return 'zan-association';
    },
});