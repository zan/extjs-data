Ext.define('Zan.data.grid.column.DateTime', {
    extend: 'Ext.grid.column.Date',
    alias: 'widget.zan-datetimecolumn',

    width: 150,

    filterType: 'date',

    constructor: function(config) {
        // Must be done in the controller because these properties may be updated after this component is defined
        config = Ext.applyIf(config, {
            format: Ext.Date.defaultFormat + ' ' + Ext.Date.defaultTimeFormat,
        });

        this.callParent([ config ])
    },

});