Ext.define('Zan.data.grid.column.Boolean', {
    extend: 'Ext.grid.column.Boolean',
    alias: 'widget.zan-booleancolumn',

    config: {
        /**
         * @cfg string Text to use when the value being rendered is null
         */
        nullText: '',
    },

    width: 100,

    trueText: 'Yes',
    falseText: 'No',

    filterType: 'boolean',

    /**
     * OVERRIDDEN to support nullText option
     */
    defaultRenderer: function(value) {
        if (value === null) return this.getNullText();

        return this.callParent([ value ]);
    },
});