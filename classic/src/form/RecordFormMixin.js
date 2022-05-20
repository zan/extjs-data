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

            var value = Zan.data.util.ModelUtil.getValue(record, field.getName());

            // Convert stores to arrays since that's what most components expect (eg. EntityTag)
            if (value instanceof Ext.data.Store) {
                value = value.getRange();
            }

            field.setValue(value);
            if (this.trackResetOnLoad) field.resetOriginalValue();
        }, this);
    },

    updateRecord: function(record) {
        // Look for form fields that map to associations
        var fields = this.getForm().getFields();

        fields.each(function(field) {
            // Skip fields without names
            if (!field.getName()) return true; // continue

            // Skip if the field is not an association
            if (!Zan.data.util.ModelUtil.isAssociation(record, field.getName())) return true; // continue

            var newValue = null;
            // If available, use custom getValueRecord()
            // todo: really necessary?
            if (Ext.isFunction(field.getValueRecord)) {
                newValue = field.getValueRecord();
            }
            // Fields with multiple value records, eg. Ext.form.field.Tag
            else if (Ext.isFunction(field.getValueRecords)) {
                newValue = field.getValueRecords();
            }
            // Fall back to Ext's getModelData()
            else {
                // This returns a key/value pair, see: https://docs.sencha.com/extjs/7.5.0/classic/Ext.form.field.ComboBox.html#method-getModelData
                var nestedValue = field.getModelData();
                newValue = nestedValue[field.getName()];
            }

            // Only update if the values are not the same
            var currValue = Zan.data.util.ModelUtil.getValue(record, field.getName());
            if (!Zan.data.util.ModelUtil.isSame(currValue, newValue)) {
                Zan.data.util.ModelUtil.setValue(record, field.getName(), newValue);
            }
        });
    },

    /**
     * Prints information on which fields are dirty within the form
     */
    debugDirtyFields: function() {
        var fields = this.getForm().getFields();
        var dirtyInfo = [];

        fields.each(function(field) {
            dirtyInfo.push({
                'field': field.getName(),
                'isDirty': field.isDirty(),
            });
        });

        console.table(dirtyInfo, ['field', 'isDirty']);
    },
});