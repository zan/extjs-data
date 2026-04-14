Ext.define('Zan.data.grid.column.Date', {
    extend: 'Ext.grid.column.Date',
    alias: 'widget.zan-datecolumn',

    width: 100,

    filterType: {
        type: 'date',
        fieldDefaults: {
            xtype: 'datefield',
        },

        // NOTE: 'onday' and 'notonday' are custom operators, see zan-data-overrides.js
        operators: ['onday', 'notonday', '>', '>=', '<', '<=', 'empty', 'nempty' ],
        operator: 'onday', // default operator
    },

    constructor: function(config) {
        // Must be done in the controller because this property may be updated after this component is defined
        config = Ext.applyIf(config, {
            format: Ext.Date.defaultFormat,
        });

        this.callParent([ config ]);
    },
});