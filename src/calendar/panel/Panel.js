Ext.define('Zan.data.calendar.panel.Panel', {
    extend: 'Ext.calendar.panel.Panel',

    requires: [
        'Zan.data.store.CalendarEntityStore',
    ],

    alias: 'widget.zan-calendar',

    constructor: function(config) {
        // Set some store defaults, if a store is passed in
        if (config.store) {
            config.store = Ext.applyIf(config.store, {
                type: 'zan-calendarentitystore',
            });
        }

        this.callParent([config]);
    },
});