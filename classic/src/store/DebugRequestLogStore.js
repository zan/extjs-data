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
    addFromRawRequest: function(request, success, response) {
        var url = null;
        var method = null;
        var params = null;
        var bodyParams = null;

        // Extract information from request depending on type
        if (request instanceof Ext.data.request.Ajax) {
            url = request.url;
            method = request.method;
            params = request.extraParams;
        }
        // todo: enumerate other types
        else {
            url = request.getUrl();
            method = request.getMethod();
            params = request.getParams();
            bodyParams = request.getJsonData();
        }

        // URL does not include query parameters for GET requests, add them back in
        if ('GET' === method && !Ext.isEmpty(params)) {
            var encodedParams = Ext.Object.toQueryString(params);
            url = url + '?' + encodedParams;
        }

        var rawData = {
            responseAt: new Date(),
            isError: !success,
            method: method,
            url: url,
            parameters: JSON.stringify(bodyParams),
        };

        if (response) {
            // Support Symfony-style debugger links
            rawData.remoteDebugLink = response.getResponseHeader('x-debug-token-link');
        }

        // Add model from raw data
        this.add(rawData);
    }
});