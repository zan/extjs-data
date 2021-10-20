Ext.define('Zan.data.page.ApiViewerPageController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.zan-data-ApiViewerPageController',

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

        var result = await Zan.data.Api.makeRequest(url, formValues.method, postData);

        if (result.sfProfilerUrl) {
            this.lookupReference('sfProfilerIframe').load(result.sfProfilerUrl);
        }

        // Might get back json data
        var responseHtml = result.responseData;
        if (!Ext.isString(result.responseData)) {
            responseHtml = '<code style="margin: 4px;">' + Ext.util.Format.htmlEncode(JSON.stringify(result.responseData)) + '</code>';
            window.debugLastResponse = result.responseData;
            console.log("Set debugLastResponse to %o", result.responseData);
        }

        this.lookupReference('responsePanel').setHtml(responseHtml);
    },
});