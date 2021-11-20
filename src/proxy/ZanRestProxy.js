Ext.define('Zan.data.proxy.ZanRestProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.zan-rest',

    requires: [
        'Zan.data.store.DebugRequestLogStore',
    ],

    doRequest(operation) {
        return this.callParent([operation]);
    },

    processResponse(success, operation, request, response) {
        var requestLogStore = Ext.data.StoreManager.get('Zan.data.DebugRequestLogStore');

        if (requestLogStore) {
            var url = request.getUrl();
            // URL does not include query parameters for GET requests, add them back in
            if ('GET' === request.getMethod() && !Ext.isEmpty(request.getParams())) {
                var encodedParams = Ext.Object.toQueryString(request.getParams());
                url = url + '?' + encodedParams;
            }
            requestLogStore.add({
                responseAt: new Date(),
                isError: !success,
                method: request.getMethod(),
                url: url,
                parameters: JSON.stringify(request.getJsonData()),
            });
        }

        if (!success) {
            // Raw URL without parameters: request.getRawRequest().requestOptions.url
            var requestUrl = request.getRawRequest().requestOptions.url;
            var requestDebugLink = '#/zan/data/api-viewer?';
            requestDebugLink += 'requestUrl=' + encodeURIComponent(requestUrl);
            requestDebugLink += '&requestMethod=' + encodeURIComponent(request.getMethod());

            if ('POST' === request.getMethod() || 'PUT' === request.getMethod() || 'PATCH' === request.getMethod()) {
                requestDebugLink += '&requestData=' + encodeURIComponent(JSON.stringify(request.getJsonData()));
            }
            if ('GET' === request.getMethod()) {
                //requestDebugLink += '&requestData=' + encodeURIComponent(JSON.stringify(request.getParams()));
                // Parameters are already part of the URL
            }

            var messageHtml = [
                'Error: ' + Ext.htmlEncode(response.status) + ' ' + Ext.htmlEncode(response.statusText),
                '<a href="' + requestDebugLink + '" target="_blank">Open in API Viewer</a>',
            ].join("<p></p>");

            Ext.Msg.alert("Request Error", messageHtml);
        }

        return this.callParent([success, operation, request, response]);
    }
});