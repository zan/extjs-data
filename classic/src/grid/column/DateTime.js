Ext.define('Zan.data.grid.column.DateTime', {
    extend: 'Ext.grid.column.Date',
    alias: 'widget.zan-datetimecolumn',

    width: 150,
    format: Ext.Date.defaultFormat + ' ' + Ext.Date.defaultTimeFormat,

});