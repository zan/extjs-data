Ext.define('Zan.data.grid.column.Boolean', {
    extend: 'Ext.grid.column.Boolean',
    alias: 'widget.zan-booleancolumn',

    width: 100,

    trueText: 'Yes',
    falseText: 'No',

    filterType: 'boolean',
});