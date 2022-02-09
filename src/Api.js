Ext.define('Zan.data.Api', {
    singleton: true,

    get: async function(url, params) {
        var rawResult = await this.makeRequest(url, 'GET', params);

        return rawResult.responseData;
    },

    post: async function(url, params) {
        var rawResult = await this.makeRequest(url, 'POST', params);

        return rawResult.responseData;
    },

    makeRequest: async function(url, method, params) {
        var me = this;
        var deferred = new Ext.Deferred();
        params = params || {};

        var responseInfo = {
            requestSuccessful: null,
            responseData: null,
            sfProfilerToken: null,
            sfProfilerUrl: null,
        };

        // Log this request in the request store
        var debugRestRequest = Zan.data.store.DebugRequestLogStore.add({
            url: url,
            method: method,
            parameters: params,
        })[0];
        console.log("rest request is: %o", debugRestRequest);

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
                debugRestRequest.set('isError', true);

                // todo: return json error response from the server
                deferred.reject("Check the network tab for more details");
            },

            callback: function(options, wasSuccessful, response) {
                debugRestRequest.set('responseAt', new Date());
            },
        };

        if (Ext.Array.contains(['POST', 'PUT', 'PATCH'], method)) {
            requestConfig.contentType = 'application/json';
            requestConfig.jsonData = params;
        }

        Ext.Ajax.request(requestConfig);

        return deferred.promise;
    },

    _parseRawResponse: function(response) {
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