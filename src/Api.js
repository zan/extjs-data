Ext.define('Zan.data.Api', {
    singleton: true,

    makeRequest(url, method, params) {
        var me = this;
        var deferred = new Ext.Deferred();

        var responseInfo = {
            requestSuccessful: null,
            responseData: null,
            sfProfilerToken: null,
            sfProfilerUrl: null,
        };

        var requestConfig = {
            method: method,
            url: url,
            disableCaching: false,

            success: (response, opts) => {
                responseInfo = me._parseRawResponse(response);
                responseInfo.requestSuccessful = true;

                deferred.resolve(responseInfo);
            },

            failure: (response, opts) => {
                responseInfo = me._parseRawResponse(response);
                responseInfo.requestSuccessful = false;

                deferred.resolve(responseInfo);
            }
        };

        if (Ext.Array.contains(['POST', 'PUT', 'PATCH'], method)) {
            requestConfig.contentType = 'application/json';
            requestConfig.jsonData = params;
        }

        Ext.Ajax.request(requestConfig);

        return deferred.promise;
    },

    _parseRawResponse(response) {
        var responseInfo = {
            requestSuccessful: null,
            responseData: null,
            sfProfilerToken: null,
            sfProfilerUrl: null,
        };

        responseInfo.sfProfilerToken = response.getResponseHeader('X-Debug-Token');
        responseInfo.sfProfilerUrl = response.getResponseHeader('X-Debug-Token-Link');

        var responseData = response.responseText;

        if (response.getResponseHeader('Content-Type') === 'application/json') {
            responseData = JSON.parse(response.responseText);
        }

        responseInfo.responseData = responseData;

        return responseInfo;
    },
});