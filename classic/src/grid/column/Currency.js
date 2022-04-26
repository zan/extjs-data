Ext.define('Zan.data.grid.column.Currency', {
    extend: 'Zan.data.grid.column.Number',
    alias: 'widget.zan-currencycolumn',

    width: 100,
    renderer: Ext.util.Format.usMoney,

    filterType: 'number',
});