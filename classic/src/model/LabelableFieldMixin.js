Ext.define('Zan.data.model.LabelableFieldMixin', {
    extend: 'Ext.Mixin',

    // CONFIG NOTE: As a performance optimization, Ext does not use the typical "config"
    //  property in the base Ext.data.field.Field class. Additional properties must be
    //  manually managed in the constructor

    // mixinConfig: {
    //     after: {
    //         constructor: 'afterConstructor',
    //     }
    // },

    onClassMixedIn: function(targetClass) {
        var proto = targetClass.prototype;
        proto.isLabelable = true;
    },

    getLabel: function() {
        return this.label;
    }
});