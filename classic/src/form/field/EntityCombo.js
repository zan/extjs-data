/**
 * Example:
        {
            xtype: 'zan-entitycombo',
            fieldLabel: 'Example Field',
            store: {
                type: 'zan-entitystore',
                model: 'App.model.ExampleFieldModel',
            },
        },

 *
 * ### Note on loading data
 *
 * The default behavior of the combo box is to delay loading data until the combo box is first expanded
 */
Ext.define('Zan.data.form.field.EntityCombo', {
    extend: 'Ext.form.field.ComboBox',

    alias: 'widget.zan-entitycombo',

    requires: [
        'Zan.data.util.ModelUtil',
    ],

    config: {
        /**
         * @cfg {Zan.data.model.EntityModel} Record that this component should write its value to
         *
         * Note that this requires specifying a 'name' as well to determine which field/association should be updated
         */
        zanValueRecord: null,
    },

    displayField: 'label',
    valueField: 'id',

    // NOTE: This must be false even though we want users to choose valid records
    // If this is true, calling setValue() with a record that does not exist in the store will cause the value to get cleared
    // This is a problem when working with historical data that may have inactive selections that are not visible
    // in the API response but are still valid values that shouldn't be overwritten with 'null'
    // todo: how to handle this validation to ensure a valid record is selected before posting to the API?
    forceSelection: false,

    queryMode: 'remote',
    lastQuery: '',          // Prevents combo box from loading twice when store autoLoad is used (expanding sends an empty query so Ext thinks it has changed)
    pageSize: 100,
    minChars: 3,            // Number of characters required before remote query is performed

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
    },

    listeners: {
        // Ensure the store has been loaded the first time the combo box is expanded
        expand: {
            fn: function(combo, opts) {
                var store = combo.getStore();
                if (!store.isLoaded()) combo.getStore().load();
            },
            single: true,
        },
    },

    initComponent: function() {
        this.callParent(arguments);

        this.on('change', this._onChange, this);
    },

    /**
     * Returns a record representing the value of this combo box
     *
     * @returns {Ext.data.Model}
     */
    getValueRecord: function() {
        var record = this.getStore().getById(this.getValue());

        // Not found, return null
        if (record === false) return null;

        return record;
    },

    updateZanValueRecord: function(record) {
        if (!this.getName()) {
            throw new Error("This field must have a 'name' set to use zanValueRecord");
        }

        var value = Zan.data.util.ModelUtil.getValue(record, this.getName());
        this.setValue(value);
    },

    _onChange: function(combo, newValue, oldValue, opts) {
        if (!this.getZanValueRecord()) return;

        var recordValue = this.getSelection();

        Zan.data.util.ModelUtil.setIfDifferent(this.getZanValueRecord(), this.getName(), recordValue);
    },
});