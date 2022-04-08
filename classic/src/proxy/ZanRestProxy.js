/**
 * todo: this should be split into a rest proxy with API debugging integration and an EntityRestProxy that incorporates
 * the default readers
 *
 * ### Features
 *
 * Allows sending complex parameters in 'params' key for GET requests.
 * These are json-encoded before being sent with the request. See sendRequest()
 */
Ext.define('Zan.data.proxy.ZanRestProxy', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.zan-rest',

    requires: [
        'Zan.data.store.DebugRequestLogStore',
    ],

    // disable the "_dc" cache busting parameter by default since requests will almost always have a query string anyway
    noCache: false,
    batchActions: true,

    reader: {
        type: 'zan-entity',
    },

    writer: {
        type: 'zan-entity',
    },

    sendRequest: function(request) {
        // Convert parameters with object data into a json-encoded representation
        // This only applies for "GET" requests
        if ('GET' === this.getMethod(request).toUpperCase()) {
            var params = request.getParams();
            var encodedParams = {};

            Ext.Object.each(params, function(key, value) {
                // Only non-scalar values need to be encoded
                if (Ext.isArray(value) || Ext.isObject(value)) {
                    encodedParams[key] = JSON.stringify(value);
                }
                else {
                    encodedParams[key] = value;
                }
            });

            request.setParams(encodedParams);
        }

        return this.callParent([ request ]);
    },

    processResponse(success, operation, request, response) {
        var requestLogStore = Ext.data.StoreManager.get('Zan.data.DebugRequestLogStore');

        if (requestLogStore) {
            requestLogStore.addFromRawRequest(request, success);
        }

        // Display a dialog for critical server errors (500 range)
        if (!success && response.status >= 500 && response.status <= 599) {
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
    },
});