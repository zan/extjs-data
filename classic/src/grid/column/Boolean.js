Ext.define('Zan.data.grid.column.DisplayString', {
    extend: 'Ext.grid.column.Boolean',
    alias: 'widget.zan-booleancolumn',

    width: 100,

    trueText: 'Yes',
    falseText: 'No',

    filterType: 'boolean',
});