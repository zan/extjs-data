Ext.define('Zan.data.grid.GridColumnFactory', {
    singleton: true,

    requires: [
        'Zan.data.grid.column.Text',
    ],

    /**
     * Returns an object describing how to configure a grid column for this field
     *
     * @param {Ext.data.field.Field} field
     */
    buildConfigFromModelField: function(field) {
        var columnDef = {
            xtype: 'zan-textcolumn',
            text: field.getName(),
            dataIndex: field.getName(),
        };

        // Added by Zan.data.model.LabelableFieldMixin
        if (field.isLabelable) {
            columnDef.text = field.getLabel();
        }

        // Field may have Zan grid integration
        if (!Ext.isEmpty(field.zanGrid)) {
            if (!Ext.isEmpty(field.zanGrid.defaultColumnWidth)) columnDef.width = field.zanGrid.defaultColumnWidth;
        }

        return columnDef;
    },
});