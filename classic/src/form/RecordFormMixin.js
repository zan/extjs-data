/**
 * todo: this can replace RecordFormPanel?
 */
Ext.define('Zan.data.form.RecordFormMixin', {
    extend: 'Ext.Mixin',
   
    mixinConfig: {
        after: {
            loadRecord: 'loadRecord',
            updateRecord: 'updateRecord',
        },
    },

    /**
     * Default Ext implementation does not load associations into form fields as expected
     *
     * NOTE: 'this' scope in this method is the class using the mixin (not the mixin itself)
     */
    loadRecord: function(record) {
        // Look for form fields that map to associations
        var fields = this.getForm().getFields();

        fields.each(function(field) {
            // Skip fields without names
            if (!field.getName()) return true; // continue

            // Skip if the field is not an association
            if (!Zan.data.util.ModelUtil.isAssociation(record, field.getName())) return true; // continue

            field.setValue(Zan.data.util.ModelUtil.getValue(record, field.getName()));
        });
    },

    updateRecord: function(record) {
        // Look for form fields that map to associations
        var fields = this.getForm().getFields();

        fields.each(function(field) {
            // Skip fields without names
            if (!field.getName()) return true; // continue

            // Skip if the field is not an association
            if (!Zan.data.util.ModelUtil.isAssociation(record, field.getName())) return true; // continue

            Zan.data.util.ModelUtil.setValue(record, field.getName(), field.getValueRecord());
        });
    },
});