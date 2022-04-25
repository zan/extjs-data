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

    put: async function(url, params) {
        var rawResult = await this.makeRequest(url, 'PUT', params);

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
        var debugParams = params;
        if ('POST' === method || 'PUT' === method) {
            debugParams = JSON.stringify(params);
        }

        var debugRestRequest = Zan.data.store.DebugRequestLogStore.add({
            url: url,
            method: method,
            parameters: debugParams,
        })[0];

        var requestConfig = {
            url: url,
            method: method,
            headers: {
                'Accept': 'application/json',
            },
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
                //deferred.reject("Check the network tab for more details");
                var error = new ZanDataApiError(
                    "API call failed: '" + responseInfo.errorMessage + "'. See the network tab for more details.",
                    responseInfo
                );
                deferred.reject(error);
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

    _parseRawResponse: function(rawResponse) {
        var responseInfo = {
            requestSuccessful: null,
            responseData: null,
            sfProfilerToken: null,
            sfProfilerUrl: null,
            errorMessage: 'Unknown Error',  // Better error message is parsed out below
            errorCode: null,
        };

        var responseData = rawResponse.responseText;
        if (rawResponse.getResponseHeader('Content-Type') === 'application/json') {
            responseData = JSON.parse(rawResponse.responseText);
        }

        // Check for errors
        if (rawResponse.status >= 500 && rawResponse.status <= 599) {
            responseInfo.requestSuccessful = false;
            if (responseData.detail) responseInfo.errorMessage = responseData.detail;
        }

        responseInfo.sfProfilerToken = rawResponse.getResponseHeader('X-Debug-Token');
        responseInfo.sfProfilerUrl = rawResponse.getResponseHeader('X-Debug-Token-Link');

        responseInfo.responseData = responseData;

        responseInfo.errorCode = this._resolveErrorCode(responseData, responseInfo);

        return responseInfo;
    },

    /**
     * Attempts to return an error code for known error situations
     */
    _resolveErrorCode: function(responseData, responseInfo) {
        // Easy case: rawResponse includes an errorCode
        if (responseData.errorCode) return responseData.errorCode;

        return null;    // return null if there weren't any matches
    },
});


// todo: can this move to overrides or some other file?
class ZanDataApiError extends Error {
    constructor(message, responseInfo) {
        super(message);

        this.name = "ZanDataApiError";
        this.responseInfo = responseInfo;
    }

    getResponseInfo() {
        return this.responseInfo;
    }
}