/**
 * 
 */
Ext.define('Zan.data.grid.column.LinkedModel', {
    extend: 'Zan.data.grid.column.Text',

    alias: 'widget.zan-linkedmodelcolumn',

    /**
     * See: https://docs.sencha.com/extjs/7.3.1/classic/Ext.grid.column.Column.html#cfg-renderer
     */
    defaultRenderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
        var stringValue = this._getStringValue(value, record, this.dataIndex);

        if (!Ext.isFunction(record.getUrl)) {
            throw new Error("Cannot link model " + record.$className + " because it does not implement getUrl()");
        }

        var url = record.getUrl();

        return '<a href="' + Ext.htmlEncode(url) + '">' + Ext.htmlEncode(stringValue) + '</a>';
    },
});