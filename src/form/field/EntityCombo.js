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

    // User must pick a valid record, if false users are able to enter string values
    forceSelection: true,

    queryMode: 'remote',
    pageSize: 100,
    minChars: 3,             // Number of characters required before remote query is performed

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

    initComponent: function() {
        this.callParent(arguments);

        this.on('change', this._onChange, this);
    },

    updateZanValueRecord: function(record) {
        if (!this.getName()) {
            throw new Error("This field must have a 'name' set to use zanValueRecord");
        }

        this.setValue(record.zanGet(this.getName()));
    },

    _onChange: function(combo, newValue, oldValue, opts) {
        if (!this.getZanValueRecord()) return;

        var recordValue = this.getSelection();

        Zan.data.util.ModelUtil.setIfDifferent(this.getZanValueRecord(), this.getName(), recordValue);
    },
});