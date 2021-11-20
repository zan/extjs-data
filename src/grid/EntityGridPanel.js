/**
 * todo features:
 *  - automatically load store on render or activate? test in tab panel
 */
Ext.define('Zan.data.grid.EntityGridPanel', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.zan-entity-grid',

    requires: [
        'Zan.data.store.EntityStore',
        'Zan.data.grid.GridColumnFactory',
    ],

    config: {
        /**
         * @cfg {Zan.data.model.EntityModel} Model to use when building store
         *
         * todo: should be a model class name here
         */
        model: '',

        /**
         * @cfg {boolean} If true enable "edit" button next to each record
         */
        enableRecordEditing: false,

        /**
         * @cfg {object[]}
         *
         * Optional array of column definitions to display before entity field columns
         */
        preColumns: [],

        /**
         * @cfg {string[]|object[]} Specific columns and configuration to display
         *
         * By default the grid displays all columns with a 'label' attribute
         *
         * By specifying fieldColumns you can configure which fields are used as columns
         * as well as additional field configuration
         *
         * todo: example
         */
        fieldColumns: null,

        /**
         * @cfg {Array} Additional fields to include in the API response when refreshing the grid
         */
        responseFields: null,
    },

    bbar: {
        xtype: 'pagingtoolbar',
        displayInfo: true
    },

    initComponent: function () {
        this.callParent(arguments);

        this.reconfigure(this._buildStore(), this._buildColumns());
    },

    refresh: function() {
        if (!this.getStore()) {
            console.warn("Attempted to refresh a grid with no store");
            return false;
        }

        this.getStore().load();
    },

    _buildStore: function() {
        var includeEditabilityMetadata = this.getEnableRecordEditing();

        return Ext.create('Zan.data.store.EntityStore', {
            model: this.getModel(),
            session: this.lookupSession(),
            pageSize: 100,
            includeEditabilityMetadata: includeEditabilityMetadata,
            responseFields: this.getResponseFields()
        });
    },

    _buildColumns: function() {
        var columns = [];

        Ext.Array.forEach(this.getPreColumns(), function(columnDef) {
            columns.push(columnDef);
        });

        if (this.getEnableRecordEditing()) {
            columns.push({
                // todo: make part of grid? or re-usable column?
                xtype: 'actioncolumn',
                width: 40,
                align: 'center',
                items: [
                    {
                        tooltip: 'Edit',
                        iconCls: 'x-fa fa-edit',
                        handler: function (table, rowIdx, colIdx, clickedItemOrColumn, evt, record, tableRow) {
                            // todo: should publish event, be configurable, etc.
                            this._editRecord(record);
                        },
                        isActionDisabled: function (table, rowIdx, colIdx, clickedItem, record) {
                            return !record.get('_isEditable');
                        },
                        scope: this,
                    }
                ]
            });
        }

        var modelClass = Ext.ClassManager.get(this.getModel());
        var modelFields = modelClass.getFields();
        var useFields = modelFields;
        var fieldCustomizations = {};

        // Fields can be customized with the fieldColumns config
        if (this.getFieldColumns()) {
            useFields = [];
            Ext.Array.forEach(this.getFieldColumns(), function(fieldColumnDef) {
                // todo: docs on this
                if (Ext.isObject(fieldColumnDef)) {
                    var extraConfig = Ext.clone(fieldColumnDef);
                    delete extraConfig.field;
                    fieldCustomizations[fieldColumnDef.field] = extraConfig;

                    // Overwrite with "field" property so it works like a string column
                    fieldColumnDef = fieldColumnDef.field;
                }
                // A string: find the model field that maps to this column
                if (Ext.isString(fieldColumnDef)) {
                    for (var i=0; i < modelFields.length; i++) {
                        if (modelFields[i].getName() === fieldColumnDef) {
                            useFields.push(modelFields[i]);
                            break;
                        }
                    }
                }
            });
        }

        Ext.Array.forEach(useFields, function(field) {
            // Fields must support several features to be supported as columns
            if (!field.isLabelable) return true;

            // Field must have a label
            if (!field.getLabel()) return true;

            columns.push(this._buildColumnFromField(field, fieldCustomizations[field.getName()]));
        }, this);

        return columns;
    },

    _buildColumnFromField: function(field, extraConfig) {
        var columnDef = Zan.data.grid.GridColumnFactory.buildConfigFromModelField(field);

        columnDef = Ext.apply(columnDef, extraConfig);

        return columnDef;
    }
});