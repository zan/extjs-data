Ext.define('Zan.data.store.CalendarEntityStore', {
    extend: 'Ext.calendar.store.Calendars',

    alias: 'store.zan-calendarentitystore',

    // Do not page calendars by default, UIs most likely don't support paging and there shouldn't be too many
    pageSize: 0,
});