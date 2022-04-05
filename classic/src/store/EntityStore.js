Ext.define('Zan.data.store.EntityStore', {
    extend: 'Ext.data.Store',

    alias: 'store.zan-entitystore',

    requires: [
        'Zan.data.reader.EntityReader',
        'Zan.data.util.EntityModelFinder',
    ],

    config: {
        /**
         * @cfg {boolean} If true, include metadata related to whether the record can be edited
         */
        includeEditabilityMetadata: false,

        /**
         * @cfg {Array} Additional fields to request from the API when loading this store
         */
        responseFields: null,
    },

    remoteSort: true,
    remoteFilter: true,
    pageSize: 100,

    constructor: function (config) {
        /*
            This exists to work around an issue where calling load() does not immediately set isLoading() to true
            By default, ext stores are "asynchronous" which means they slightly delay the load operation.
            If you call load() twice in a row on the same store you may see isLoading() as false on the second call
            See load() implementation: https://docs.sencha.com/extjs/7.3.1/classic/src/ProxyStore.js.html#Ext.data.ProxyStore-method-load
            As an alternative, you can set asynchronousLoad on the store: https://docs.sencha.com/extjs/7.3.1/classic/Ext.data.Store.html#cfg-asynchronousLoad
            EXT_VERIFY_AFTER_UPGRADE to see if it's fixed
         */
        this._zanIsLoading = false;

        if (!config.model) {
            throw("'model' is a required config parameter");
        }
        var modelClass = Ext.ClassManager.get(config.model);
        if (!modelClass) {
            throw("Model class was not valid");
        }

        var includeMetadata = [];
        if (config.includeEditabilityMetadata) {
            includeMetadata.push('editability');
        }

        var extraParams = config.extraParams || {};
        if (includeMetadata.length > 0) {
            extraParams.includeMetadata = includeMetadata;
        }

        // todo: includeMetadata needs to be passed when calling load() methods

        this.callParent([config]);
    },

    load: function(options) {
        options = options || {};
        options.params = options.params || {};
        options.params.includeMetadata = options.params.includeMetadata || [];

        // pass 'responseFields' in params when parent store loads
        if (this.getResponseFields()) {
            options.params = Ext.apply(options.params, {
                responseFields: this.getResponseFields()
            });
        }

        if (this.getIncludeEditabilityMetadata()) {
            options.params.includeMetadata.push('editability');
        }

        return this.callParent([ options ]);
    },

    async ensureLoaded(source) {
        const deferred = new Ext.Deferred();

        // Already loaded: immediately resolve
        if (this.isLoaded()) {
            deferred.resolve();
        }
        // Loading: wait until it's finished and then resolve
        else if (this.isLoading() || this._zanIsLoading) {
            this.on(
                'load',
                () => {
                    deferred.resolve();
                },
                this,
                { single: true },
            );
        }
        // Not loaded yet: call load()
        else {
            this._zanIsLoading = true;
            this.load({
                callback: function(records, operation, success) {
                    deferred.resolve();
                }
            });
        }

        return deferred.promise;
    },

    _getEntityIdForUrl: function(entityId) {
        // Replace backslashes with dots
        var forUrl = entityId.replace(/\\/g, '.');

        // Remove initial dot
        forUrl = Zan.String.removePrefix(forUrl, '.');

        return forUrl;
    }
});
