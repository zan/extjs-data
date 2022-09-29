Ext.define('Zan.data.page.ApiViewerPageController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Zan.data.Api',
    ],

    async onDoRequest() {
        var formValues = this.lookupReference('form').getValues();
        var postData = {};
        //console.log("values: %o", formValues);

        var url = formValues.url;
        if ('GET' === formValues.method) {
            if (formValues.paramsText) url += '?' + formValues.paramsText;
        }
        if (Ext.Array.contains(['POST', 'PUT', 'PATCH'], formValues.method)) {
            postData = JSON.parse(formValues.paramsText);
        }

        if (formValues.zan_enableDebugging) {
            url = Zan.common.Url.setUrlVar(url, 'zan_enableDebugging', true);
        }

        var doRequestButton = this.lookup('doRequestButton');
        var oldText = doRequestButton.getText();
        doRequestButton.setText('Requesting...');
        doRequestButton.disable();

        var result = null;
        try {
            result = await Zan.data.Api.makeRequest(url, formValues.method, postData);
        } catch (ex) {
            console.log(ex);
            console.log("raw response: %o", ex.getResponseInfo());
            result = ex.getResponseInfo();
        }

        doRequestButton.setText(oldText);
        doRequestButton.enable();

        // Update URL with most recent successful request
        this._syncUrl();

        if (result.sfProfilerUrl) {
            // Briefly delay to give SF time to write profiler information to disk
            var me = this;
            setTimeout(function() {
                me.lookupReference('sfProfilerIframe').load(result.sfProfilerUrl);
            }, 100);
        }

        // Might get back json data
        var responseHtml = result.responseData;
        if (!Ext.isString(result.responseData)) {
            responseHtml = '<code style="margin: 4px;">' + Ext.util.Format.htmlEncode(JSON.stringify(result.responseData)) + '</code>';
            window.debugLastResponse = result.responseData;
            console.log("Set debugLastResponse to %o", result.responseData);
        }

        this.lookupReference('responsePanel').loadResponseInfo(result);
    },

    _syncUrl: function() {
        var formValues = this.lookupReference('form').getValues();
        var currUrl = location.hash;

        var newUrl = Zan.common.Url.setUrlVar(currUrl, 'requestUrl', formValues.url);
        newUrl = Zan.common.Url.setUrlVar(newUrl, 'requestMethod', formValues.method);

        Zan.common.Url.setBrowserUrl(newUrl);
    }
});