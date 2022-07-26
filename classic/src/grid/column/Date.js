Ext.define('Zan.data.grid.column.Date', {
    extend: 'Ext.grid.column.Date',
    alias: 'widget.zan-datecolumn',

    width: 100,

    filterType: {
        type: 'date',
        fieldDefaults: {
            xtype: 'datefield',
        },

        operators: ['onday', 'notonday', '>', '>=', '<', '<=', 'empty', 'nempty' ],
        operator: 'onday', // default operator
    },

    constructor: function(config) {
        // Add additional supported operators
        Ext.grid.plugin.filterbar.Operator.addOperator('onday', 'x-fa fa-calendar-day', 'On Day');
        Ext.grid.plugin.filterbar.Operator.addOperator('notonday', 'x-fa fa-calendar-times', 'Not On Day');

        // Must be done in the controller because this property may be updated after this component is defined
        config = Ext.applyIf(config, {
            format: Ext.Date.defaultFormat,
        });

        this.callParent([ config ]);
    },
});