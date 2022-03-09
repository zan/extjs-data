/**
 * Represents an XHR request made by the application. This model is used for debugging purposes
 *
 * See also: DebugRequestLogStore
 */
Ext.define('Zan.data.model.RestRequestModel', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'responseAt', type: 'date' },
        { name: 'url', type: 'string' },
        { name: 'method', type: 'string' },
        { name: 'parameters', type: 'string' },
        { name: 'isError', type: 'bool' }
    ]
});