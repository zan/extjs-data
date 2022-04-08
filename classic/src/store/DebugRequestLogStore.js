Ext.define('Zan.data.store.DebugRequestLogStore', {
    extend: 'Ext.data.Store',
    singleton: true,

    requires: [
        'Zan.data.model.RestRequestModel'
    ],

    storeId: 'Zan.data.DebugRequestLogStore',

    model: 'Zan.data.model.RestRequestModel',
    sorters: [
        { property: 'responseAt', direction: 'DESC' },
    ],

    /**
     *
     */
    addFromRawRequest: function(request, success) {
        var url = request.getUrl();

        // URL does not include query parameters for GET requests, add them back in
        if ('GET' === request.getMethod() && !Ext.isEmpty(request.getParams())) {
            var encodedParams = Ext.Object.toQueryString(request.getParams());
            url = url + '?' + encodedParams;
        }

        this.add({
            responseAt: new Date(),
            isError: !success,
            method: request.getMethod(),
            url: url,
            parameters: JSON.stringify(request.getJsonData()),
        });
    }
});