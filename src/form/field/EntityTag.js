/**
 * todo: Lots of shared configuration with Zan.data.form.field.ComboBox, is there a way to use a mixin or some other
 *  way to share configuration?
 */
Ext.define('Zan.data.form.field.EntityTag', {
    extend: 'Ext.form.field.Tag',

    requires: [
        'Zan.data.util.StoreUtil',
    ],

    config: {
        /**
         * @cfg {Zan.data.model.EntityModel} Record that this component should write its value to
         *
         * Note that this requires specifying a 'name' as well to determine which field/association should be updated
         *
         * This component requires that 'name' maps to a store
         */
        zanValueRecord: null,

        /**
         * @cfg {Ext.data.Store} A store that should be updated with the selected records in this combo box
         *
         * This is automatically set if zanValueRecord and a 'name' is set
         */
        valueStore: null,
    },

    displayField: 'label',
    valueField: 'id',

    queryMode: 'remote',
    pageSize: 100,
    minChars: 3,             // Number of characters required before remote query is performed

    // todo: necessary?
    autoLoadOnValue: true,

    // Without this minWidth the paging controls are cut off when there aren't any results
    // in the picker or when the field is too small
    minWidth: 375,

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

        var valueStore = record.zanGet(this.getName());

        if (!(valueStore instanceof Ext.data.Store)) throw new Error(this.getName() + " must be an association that uses a store");

        this.setValue(valueStore.getRange());
        this.setValueStore(valueStore);
    },

    _onChange: function(combo, newValue, oldValue, opts) {
        if (!this.getZanValueRecord()) return;
        if (!this.getValueStore()) return;

        var valueRecords = this.getValueRecords();

        // Sync the value store with this tag's store
        Zan.data.util.StoreUtil.setRecords(this.getValueStore(), valueRecords);
    },
});